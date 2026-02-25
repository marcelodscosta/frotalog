import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

let token: string
let clientId: string
let contractId: string
let assetCategoryId: string
let assetId: string
let createdMovementId: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Asset Movement E2E', () => {
  beforeAll(async () => {
    await app.ready()
    token = generateToken()

    // Create prerequisite data
    const category = await prisma.assetCategory.create({
      data: {
        name: `E2E Category ${Date.now()}`,
        description: 'Category for E2E tests',
        type: 'EQUIPMENT',
      },
    })
    assetCategoryId = category.id

    const asset = await prisma.asset.create({
      data: {
        brand: 'E2E Brand',
        model: 'E2E Model',
        assetCategoryId,
      },
    })
    assetId = asset.id

    const client = await prisma.supplier.create({
      data: {
        company_name: 'E2E Movement Client',
        cnpj: `${Date.now()}`,
        email: 'e2e-movement@test.com',
        phone: '11888888888',
        contact: 'E2E Movement Tester',
        isClient: true,
      },
    })
    clientId = client.id

    const contract = await prisma.contract.create({
      data: {
        contract_number: `E2E-MV-${Date.now()}`,
        clientId,
        start_date: new Date('2026-01-01'),
      },
    })
    contractId = contract.id
  })

  afterAll(async () => {
    // Clean up in reverse order of dependencies
    await prisma.assetMovement.deleteMany({
      where: { contractId },
    })
    await prisma.contract.delete({ where: { id: contractId } })
    await prisma.supplier.delete({ where: { id: clientId } })
    await prisma.asset.delete({ where: { id: assetId } })
    await prisma.assetCategory.delete({ where: { id: assetCategoryId } })
    await app.close()
  })

  it('POST /asset-movements - should create an asset movement', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/asset-movements',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        contractId,
        assetId,
        rental_value: 5000,
        billing_cycle: 'MONTHLY',
        operator_name: 'Operador E2E',
        delivery_location: 'Obra E2E',
      },
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.assetMovement).toBeDefined()
    expect(body.assetMovement.contractId).toBe(contractId)
    expect(body.assetMovement.assetId).toBe(assetId)
    createdMovementId = body.assetMovement.id
  })

  it('GET /asset-movements/:id - should get movement by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/asset-movements/${createdMovementId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.assetMovement.id).toBe(createdMovementId)
  })

  it('GET /asset-movements - should list movements with pagination', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/asset-movements?page=1',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toBeDefined()
    expect(body.currentPage).toBe(1)
  })

  it('PATCH /asset-movements/:id - should update an asset movement', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/asset-movements/${createdMovementId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        operator_name: 'Operador Atualizado',
        notes: 'Nota E2E',
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.assetMovement.operator_name).toBe('Operador Atualizado')
    expect(body.assetMovement.notes).toBe('Nota E2E')
  })

  it('GET /contracts/:contractId/asset-movements - should list movements by contract', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/contracts/${contractId}/asset-movements?page=1`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toBeDefined()
  })

  it('GET /assets/:assetId/asset-movements - should list movements by asset', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/assets/${assetId}/asset-movements?page=1`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toBeDefined()
  })

  it('should return 401 without auth token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/asset-movements?page=1',
    })

    expect(response.statusCode).toBe(401)
  })

  it('DELETE /asset-movements/:id - should delete an asset movement', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/asset-movements/${createdMovementId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(204)
  })
})
