import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

let assetId: string
let supplierId: string
let createdMaintenanceId: string
let maintenanceToken: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Maintenance E2E', () => {
  beforeAll(async () => {
    await app.ready()
    maintenanceToken = generateToken()

    // 1. Create a Category
    const category = await prisma.assetCategory.create({
      data: {
        name: 'E2E Maintenance Category',
        description: 'Test',
        type: 'EQUIPMENT',
      },
    })

    // 2. Create an Asset
    const asset = await prisma.asset.create({
      data: {
        brand: 'Caterpillar',
        model: 'E2E-Model',
        year: 2024,
        plate: 'E2E-9999',
        serial_number: 'E2ESERIAL123',
        assetCategoryId: category.id,
        current_horometer: 100,
        current_odometer: 1000,
      },
    })
    assetId = asset.id

    // 3. Create a Supplier
    const supplier = await prisma.supplier.create({
      data: {
        company_name: 'E2E Maintenance Supplier',
        cnpj: `99${Date.now()}99`,
        email: 'e2e-maint@supplier.com',
        phone: '11999999999',
        contact: 'E2E Testing Contact',
        isClient: false,
      },
    })
    supplierId = supplier.id
  })

  afterAll(async () => {
    // Clean up
    if (maintenanceToken) {
       await prisma.maintenanceDocument.deleteMany()
       await prisma.maintenance.deleteMany({ where: { assetId } })
    }
    if (assetId) await prisma.asset.delete({ where: { id: assetId } })
    if (supplierId) await prisma.supplier.delete({ where: { id: supplierId } })
    await prisma.assetCategory.deleteMany({
      where: { name: 'E2E Maintenance Category' },
    })
    await app.close()
  })

  it('POST /maintenance - should create a maintenance', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/maintenance',
      headers: {
        Authorization: `Bearer ${maintenanceToken}`,
      },
      payload: {
        assetId,
        supplierId,
        type: 'PREVENTIVE',
        description: 'E2E Test Description for Maintenance',
        scheduled_date: new Date('2026-03-01').toISOString(),
        estimated_cost: 1500,
      },
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.maintenance).toBeDefined()
    expect(body.maintenance.assetId).toBe(assetId)
    expect(body.maintenance.type).toBe('PREVENTIVE')
    createdMaintenanceId = body.maintenance.id
  })

  it('POST /maintenance/quick - should create quick maintenance', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/maintenance/quick',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
      payload: {
        assetId,
        description: 'E2E Quick Maintenance Description',
        date: new Date().toISOString(),
        horometer: 150,
      },
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.maintenance.status).toBe('COMPLETED')
    expect(body.maintenance.description).toBe('E2E Quick Maintenance Description')
  })

  it('GET /maintenance/search/:id - should get maintenance by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/maintenance/search/${createdMaintenanceId}`,
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().id).toBe(createdMaintenanceId)
  })

  it('PATCH /maintenance/:id - should update maintenance details', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/maintenance/${createdMaintenanceId}`,
      headers: { Authorization: `Bearer ${maintenanceToken}` },
      payload: {
        description: 'Updated E2E Description for Maintenance',
        estimated_cost: 2000,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().maintenance.description).toBe('Updated E2E Description for Maintenance')
    expect(Number(response.json().maintenance.estimated_cost)).toBe(2000)
  })

  it('PATCH /maintenance/:id/status - should update status', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/maintenance/${createdMaintenanceId}/status`,
      headers: { Authorization: `Bearer ${maintenanceToken}` },
      payload: {
        status: 'IN_PROGRESS',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().maintenance.status).toBe('IN_PROGRESS')
  })

  it('GET /maintenance/search - should list all maintenances paginated', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/search?page=1',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.maintenances).toBeDefined()
    expect(body.maintenances.length).toBeGreaterThan(0)
  })

  it('GET /maintenance/search/plate - should filter by plate', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/search/plate?plate=E2E-9999&page=1',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().maintenances.length).toBeGreaterThan(0)
  })

  it('GET /maintenance/search/serial - should filter by serial', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/search/serial?serialNumber=E2ESERIAL123&page=1',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().maintenances.length).toBeGreaterThan(0)
  })

  it('GET /maintenance/search/status - should filter by status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/search/status?status=IN_PROGRESS&page=1',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().maintenances.length).toBeGreaterThan(0)
  })

  it('GET /maintenance/search/type - should filter by type', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/search/type?type=PREVENTIVE&page=1',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().maintenances.length).toBeGreaterThan(0)
  })

  it('GET /maintenance/scheduled - should list scheduled maintenances', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/scheduled',
      headers: { Authorization: `Bearer ${maintenanceToken}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.all).toBeDefined()
  })

  it('should return 401 when no token is provided', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/maintenance/search',
    })

    expect(response.statusCode).toBe(401)
  })
})
