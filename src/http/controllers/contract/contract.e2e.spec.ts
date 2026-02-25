import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

let clientId: string
let createdContractId: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Contract E2E', () => {
  beforeAll(async () => {
    await app.ready()

    // Create a client (supplier with isClient=true) for contract tests
    const client = await prisma.supplier.create({
      data: {
        company_name: 'E2E Test Client',
        cnpj: `${Date.now()}`,
        email: 'e2e-client@test.com',
        phone: '11999999999',
        contact: 'E2E Tester',
        isClient: true,
      },
    })
    clientId = client.id
  })

  afterAll(async () => {
    // Clean up: delete contracts created in tests, then the client
    await prisma.contract.deleteMany({
      where: { clientId },
    })
    await prisma.supplier.delete({
      where: { id: clientId },
    })
    await app.close()
  })

  it('POST /contract - should create a contract', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/contract',
      payload: {
        contract_number: `E2E-CT-${Date.now()}`,
        description: 'Contrato E2E Test',
        clientId,
        start_date: '2026-01-01',
        total_value: 50000,
      },
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.contract).toBeDefined()
    expect(body.contract.clientId).toBe(clientId)
    createdContractId = body.contract.id
  })

  it('GET /contract/:id - should get contract by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/contract/${createdContractId}`,
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.id).toBe(createdContractId)
  })

  it('GET /contract/:id - should return 404 for non-existent contract', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/contract/00000000-0000-0000-0000-000000000000',
    })

    expect(response.statusCode).toBe(404)
  })

  it('PATCH /contract/:id - should update a contract', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/contract/${createdContractId}`,
      payload: {
        description: 'Descrição atualizada E2E',
        responsible_name: 'Responsável E2E',
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.contract.description).toBe('Descrição atualizada E2E')
    expect(body.contract.responsible_name).toBe('Responsável E2E')
  })

  it('GET /contracts - should list contracts with pagination', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/contracts?page=1',
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.contracts).toBeDefined()
    expect(body.contracts.items).toBeDefined()
    expect(body.contracts.currentPage).toBe(1)
  })

  it('PATCH /contract/:id/delete - should soft delete a contract', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/contract/${createdContractId}/delete`,
    })

    expect(response.statusCode).toBe(200)
  })
})
