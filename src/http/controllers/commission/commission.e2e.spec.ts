import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

function generateToken(role: 'ADMIN' | 'EMPLOYEE' = 'ADMIN') {
  return jwt.sign(
    { sub: 'test-user-id', email: 'admin@test.com', role },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Commission Workflow E2E', () => {
  let testContractId: string
  let testSellerId: string
  let adminToken: string

  beforeAll(async () => {
    await app.ready()
    adminToken = generateToken('ADMIN')

    // 1. Garantir que temos um vendedor (usuário)
    let seller = await prisma.user.findFirst()
    if (!seller) {
      seller = await prisma.user.create({
        data: {
          name: 'Test Seller',
          email: `seller-${Date.now()}@test.com`,
          password_hash: 'hash',
          role: 'EMPLOYEE',
        },
      })
    }
    testSellerId = seller.id

    // 2. Garantir que temos um cliente
    let client = await prisma.supplier.findFirst({ where: { isClient: true } })
    if (!client) {
      client = await prisma.supplier.create({
        data: {
          company_name: 'Test Client for Commissions',
          cnpj: `CNPJ-${Date.now()}`,
          email: 'client@test.com',
          phone: '123',
          contact: 'Test',
          isClient: true,
        },
      })
    }

    // 3. Criar ou atualizar um contrato para ter comissão (usando data retroativa para testar geração de grade)
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3) // 3 meses atrás

    const contract = await prisma.contract.create({
      data: {
        contract_number: `TEST-COMM-${Date.now()}`,
        clientId: client.id,
        sellerId: testSellerId,
        commission_percentage: 5.5, // 5.5%
        commission_start_date: startDate,
        start_date: startDate,
        status: 'ACTIVE',
      },
    })
    testContractId = contract.id
  })

  afterAll(async () => {
    // Limpeza
    await prisma.commission.deleteMany({ where: { contractId: testContractId } })
    await prisma.contract.delete({ where: { id: testContractId } })
    await app.close()
  })

  it('deve gerar a grade de comissões mensal automaticamente ao listar', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/contract/${testContractId}/commissions`,
      headers: { authorization: `Bearer ${adminToken}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    
    // Deve ter pelo menos 3 ou 4 meses (dependendo do dia atual e start_date)
    expect(body.items.length).toBeGreaterThanOrEqual(3)
    expect(body.summary.count).toBe(body.items.length)
    
    // Todas as comissões devem ter nascido com valor 0 e status PENDING
    body.items.forEach((c: any) => {
      expect(Number(c.commission_percentage)).toBe(5.5)
      expect(Number(c.commission_value)).toBe(0)
      expect(c.status).toBe('PENDING')
    })
  })

  it('deve permitir atualizar o valor base e recalcular a comissão', async () => {
    // Pegar a primeira comissão gerada
    const listResponse = await app.inject({
      method: 'GET',
      url: `/contract/${testContractId}/commissions`,
      headers: { authorization: `Bearer ${adminToken}` },
    })
    const commissionId = listResponse.json().items[0].id

    // Atualizar valor base para R$ 10.000,00
    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/commissions/${commissionId}`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: {
        base_value: 10000,
      },
    })

    expect(updateResponse.statusCode).toBe(200)
    const updated = updateResponse.json().commission
    
    // 10.000 * 5.5% = 550
    expect(Number(updated.base_value)).toBe(10000)
    expect(Number(updated.commission_value)).toBe(550)
    expect(updated.status).toBe('PENDING') // O status permanece PENDING até ser confirmado manualmente
  })

  it('deve permitir pagar uma comissão e registrar a data', async () => {
    const listResponse = await app.inject({
      method: 'GET',
      url: `/contract/${testContractId}/commissions`,
      headers: { authorization: `Bearer ${adminToken}` },
    })
    const commissionId = listResponse.json().items[0].id

    const payResponse = await app.inject({
      method: 'PATCH',
      url: `/commissions/${commissionId}/status`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: {
        status: 'PAID',
      },
    })

    expect(payResponse.statusCode).toBe(200)
    const paid = payResponse.json().commission
    expect(paid.status).toBe('PAID')
    expect(paid.paid_at).toBeDefined()
  })

  it('deve listar comissões no relatório geral com filtros', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/commissions',
      headers: { authorization: `Bearer ${adminToken}` },
      query: {
        sellerId: testSellerId,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items.length).toBeGreaterThanOrEqual(1)
    expect(body.summary.totalConfirmed).toBeGreaterThanOrEqual(0)
  })

  it('deve excluir comissões CANCELLED dos totais financeiros', async () => {
    // 1. Pegar uma comissão e cancelar
    const listResponse = await app.inject({
      method: 'GET',
      url: `/contract/${testContractId}/commissions`,
      headers: { authorization: `Bearer ${adminToken}` },
    })
    const commissionId = listResponse.json().items[1].id // Pegar a segunda comissão

    await app.inject({
      method: 'PATCH',
      url: `/commissions/${commissionId}/status`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { status: 'CANCELLED' },
    })

    // 2. Verificar o sumário no endpoint de contrato
    const summaryResponse = await app.inject({
      method: 'GET',
      url: `/contract/${testContractId}/commissions`,
      headers: { authorization: `Bearer ${adminToken}` },
    })

    const body = summaryResponse.json()
    const cancelledCount = body.items.filter((c: any) => c.status === 'CANCELLED').length
    expect(cancelledCount).toBe(1)
    expect(body.summary.count).toBe(body.items.length - 1) // Sumário deve ignorar o cancelado
  })
})
