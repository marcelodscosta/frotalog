import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

/**
 * E2E Tests for all report endpoints.
 * All require JWT auth.
 * Reports query the real database via Prisma.
 */

let token: string
let categoryId: string
let assetId: string
let clientId: string
let supplierId: string
let contractId: string
let movementId: string
let maintenanceId: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-report-user', email: 'e2e-report@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Reports E2E', () => {
  beforeAll(async () => {
    await app.ready()
    token = generateToken()

    // Create test data ecosystem
    const category = await prisma.assetCategory.create({
      data: { name: `E2E Report Category ${Date.now()}`, type: 'EQUIPMENT' },
    })
    categoryId = category.id

    const asset = await prisma.asset.create({
      data: {
        brand: 'CAT',
        model: 'Escavadeira 320',
        assetCategoryId: categoryId,
        current_horometer: 1500,
        current_odometer: 50000,
        maintenance_frequency_hours: 500,
        last_maintenance_horometer: 1200,
      },
    })
    assetId = asset.id

    const client = await prisma.supplier.create({
      data: {
        company_name: `E2E Report Client ${Date.now()}`,
        cnpj: `RC${Date.now()}`,
        email: 'e2e-report-client@test.com',
        phone: '11999990000',
        contact: 'Tester',
        isClient: true,
      },
    })
    clientId = client.id

    const supplier = await prisma.supplier.create({
      data: {
        company_name: `E2E Report Supplier ${Date.now()}`,
        cnpj: `RS${Date.now()}`,
        email: 'e2e-report-supplier@test.com',
        phone: '11999990001',
        contact: 'Supplier Tester',
        isClient: false,
      },
    })
    supplierId = supplier.id

    const contract = await prisma.contract.create({
      data: {
        contract_number: `E2E-RPT-${Date.now()}`,
        clientId,
        start_date: new Date('2026-01-01'),
        status: 'ACTIVE',
      },
    })
    contractId = contract.id

    const movement = await prisma.assetMovement.create({
      data: {
        contractId,
        assetId,
        mobilization_date: new Date('2026-01-10'),
        rental_value: 15000,
        billing_cycle: 'MONTHLY',
      },
    })
    movementId = movement.id

    // Create a completed maintenance (for financial report)
    const maintenance = await prisma.maintenance.create({
      data: {
        assetId,
        supplierId,
        type: 'CORRECTIVE',
        description: 'Troca de bomba hidráulica E2E',
        scheduled_date: new Date('2026-01-15'),
        started_date: new Date('2026-01-16'),
        completed_date: new Date('2026-01-20'),
        status: 'COMPLETED',
        estimated_cost: 5000,
        actual_cost: 6200,
        equipment_inactive: true,
      },
    })
    maintenanceId = maintenance.id
  })

  afterAll(async () => {
    await prisma.maintenance.deleteMany({ where: { assetId } }).catch(() => {})
    await prisma.assetMovement.deleteMany({ where: { contractId } })
    await prisma.contract.delete({ where: { id: contractId } })
    await prisma.supplier.delete({ where: { id: clientId } })
    await prisma.supplier.delete({ where: { id: supplierId } })
    await prisma.asset.delete({ where: { id: assetId } })
    await prisma.assetCategory.delete({ where: { id: categoryId } })
    await app.close()
  })

  // ─── Relatório: Disponibilidade de Ativos ───

  it('GET /reports/assets-availability - should return availability report', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/reports/assets-availability',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.report).toBeDefined()
    expect(body.report.totalAssets).toBeGreaterThanOrEqual(1)
    expect(body.report.details).toBeDefined()
    expect(body.report.details.length).toBeGreaterThanOrEqual(1)

    // Our test asset should be allocated (has active movement)
    const testAsset = body.report.details.find((d: any) => d.id === assetId)
    expect(testAsset).toBeDefined()
    expect(testAsset.status).toBe('ALLOCATED')
  })

  // ─── Relatório: Ativos por Obra ───

  it('GET /reports/assets-by-worksite - should return worksite report', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/reports/assets-by-worksite',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.report).toBeDefined()
    expect(Array.isArray(body.report)).toBe(true)

    // Should have at least one worksite group with our test data
    expect(body.report.length).toBeGreaterThanOrEqual(1)

    // Each group should have categories
    body.report.forEach((group: any) => {
      expect(group.worksiteName).toBeDefined()
      expect(group.categories).toBeDefined()
      expect(Array.isArray(group.categories)).toBe(true)
    })
  })

  // ─── Relatório: Previsão de Manutenção ───

  it('GET /reports/maintenance-prediction - should return prediction report', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/reports/maintenance-prediction',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.report).toBeDefined()
    expect(Array.isArray(body.report)).toBe(true)

    // Our asset has maintenance_frequency_hours=500, current=1500, last=1200
    // next = 1200 + 500 = 1700, remaining = 1700 - 1500 = 200
    // 200 / 500 = 40% remaining → should be OK or WARNING (>10%) → should be OK
    const testAsset = body.report.find((a: any) => a.id === assetId)
    expect(testAsset).toBeDefined()
    expect(testAsset.currentHorometer).toBe(1500)
    expect(testAsset.remainingHours).toBe(200)
    expect(testAsset.status).toBe('OK')
  })

  // ─── Relatório: Financeiro de Manutenção ───

  it('GET /reports/maintenance-financial - should return financial report', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/reports/maintenance-financial?startDate=2026-01-01&endDate=2026-12-31&groupBy=ASSET`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.report).toBeDefined()
    expect(body.totalOverall).toBeDefined()

    // Our maintenance has actual_cost of 6200
    expect(body.totalOverall).toBeGreaterThanOrEqual(6200)
  })

  it('GET /reports/maintenance-financial - should group by SUPPLIER', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/reports/maintenance-financial?startDate=2026-01-01&endDate=2026-12-31&groupBy=SUPPLIER`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.report).toBeDefined()
    expect(body.report.length).toBeGreaterThanOrEqual(1)
  })

  // ─── Relatório: Manutenção por Ativo (status diário) ───

  it('GET /reports/maintenance/asset - should return daily status report', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/reports/maintenance/asset?assetId=${assetId}&startDate=2026-01-01&endDate=2026-01-31`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.maintenances).toBeDefined()
    expect(body.summary).toBeDefined()
    expect(body.dailyStatus).toBeDefined()

    // 31 days in January
    expect(body.dailyStatus).toHaveLength(31)
    expect(body.summary.totalDays).toBe(31)

    // Should have inoperative days (maintenance from Jan 16-20)
    expect(body.summary.inoperativeDays).toBeGreaterThan(0)
    expect(body.summary.operativeDays).toBeGreaterThan(0)

    // Check specific days
    const jan16 = body.dailyStatus.find((d: any) => d.date === '2026-01-16')
    expect(jan16?.status).toBe('INOPERATIVE')

    const jan01 = body.dailyStatus.find((d: any) => d.date === '2026-01-01')
    expect(jan01?.status).toBe('OPERATIVE')
  })

  // ─── Cenário: Autenticação obrigatória ───

  it('should return 401 for all report endpoints without auth', async () => {
    const endpoints = [
      '/reports/assets-availability',
      '/reports/assets-by-worksite',
      '/reports/maintenance-prediction',
      '/reports/maintenance-financial?startDate=2026-01-01&endDate=2026-12-31',
      `/reports/maintenance/asset?assetId=${assetId}&startDate=2026-01-01&endDate=2026-01-31`,
    ]

    for (const url of endpoints) {
      const response = await app.inject({ method: 'GET', url })
      expect(response.statusCode).toBe(401)
    }
  })
})
