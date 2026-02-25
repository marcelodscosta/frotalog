import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

/**
 * E2E Test: Fluxo completo de Medição e Fatura
 *
 * Cenário principal: Máquina alugada dia 16, desmobilizada dia 25, mês de 28 dias (fev)
 * Aluguel mensal cheio = R$15.000
 * Mês comercial = 30 dias (sempre)
 * dailyRate = 15000 / 30 = R$500/dia
 *
 * Período: 16/fev a 25/fev = 10 dias
 * totalValue = 500 * 10 = R$5.000
 */

let token: string
let clientId: string
let contractId: string
let assetCategoryId: string
let assetId: string
let movementId: string
let bulletinId: string
let invoiceId: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Measurement Bulletin & Invoice E2E - Proportional Billing', () => {
  beforeAll(async () => {
    await app.ready()
    token = generateToken()

    // Create prerequisite data
    const category = await prisma.assetCategory.create({
      data: {
        name: `E2E Bulletin Category ${Date.now()}`,
        type: 'EQUIPMENT',
      },
    })
    assetCategoryId = category.id

    const asset = await prisma.asset.create({
      data: {
        brand: 'CAT',
        model: 'Escavadeira 320',
        assetCategoryId,
      },
    })
    assetId = asset.id

    const client = await prisma.supplier.create({
      data: {
        company_name: `E2E Bulletin Client ${Date.now()}`,
        cnpj: `${Date.now()}`,
        email: 'e2e-bulletin@test.com',
        phone: '11999999999',
        contact: 'Tester',
        isClient: true,
      },
    })
    clientId = client.id

    const contract = await prisma.contract.create({
      data: {
        contract_number: `E2E-BUL-${Date.now()}`,
        clientId,
        start_date: new Date('2026-01-01'),
        status: 'ACTIVE',
      },
    })
    contractId = contract.id

    // Create asset movement: rented on Feb 16, demobilized Feb 25, R$15000/month
    const movement = await prisma.assetMovement.create({
      data: {
        contractId,
        assetId,
        mobilization_date: new Date('2026-02-16'),
        demobilization_date: new Date('2026-02-25'),
        rental_value: 15000,
        billing_cycle: 'MONTHLY',
      },
    })
    movementId = movement.id
  })

  afterAll(async () => {
    // Clean up in reverse dependency order
    // Always use deleteMany where possible to handle soft-deleted records
    await prisma.invoice
      .deleteMany({ where: { measurementBulletinId: { not: undefined } } })
      .catch(() => {})
    await prisma.measurementBulletin
      .deleteMany({ where: { assetMovementId: movementId } })
      .catch(() => {})
    await prisma.assetMovement.deleteMany({ where: { contractId } })
    await prisma.contract.delete({ where: { id: contractId } })
    await prisma.supplier.delete({ where: { id: clientId } })
    await prisma.asset.delete({ where: { id: assetId } })
    await prisma.assetCategory.delete({ where: { id: assetCategoryId } })
  })

  // ─── Cenário 1: Período proporcional (16/fev a 25/fev) ───

  it('should create a measurement bulletin with proportional billing (10 days)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/measurement-bulletins',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        contractId,
        assetMovementId: movementId,
        reference_start: '2026-02-16',
        reference_end: '2026-02-25',
      },
    })

    expect(response.statusCode).toBe(201)
    const body = response.json()
    const bulletin = body.measurementBulletin

    bulletinId = bulletin.id

    // Verify proportional calculation:
    // 10 days (Feb 16-25 inclusive)
    // dailyRate = 15000 / 30 = 500.00
    // totalValue = 500 * 10 = 5000.00
    expect(bulletin.total_days).toBe(10)
    expect(bulletin.inactive_days).toBe(0)
    expect(bulletin.working_days).toBe(10)
    expect(Number(bulletin.daily_rate)).toBeCloseTo(500, 2)
    expect(Number(bulletin.total_value)).toBeCloseTo(5000, 2)
  })

  it('should get bulletin with correct proportional values', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/measurement-bulletins/${bulletinId}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const bulletin = response.json().measurementBulletin

    expect(bulletin.working_days).toBe(10)
    expect(Number(bulletin.daily_rate)).toBeCloseTo(500, 2)
    expect(Number(bulletin.total_value)).toBeCloseTo(5000, 2)
  })

  it('should list bulletins filtered by contract', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/measurement-bulletins?contractId=${contractId}&page=1`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items.length).toBeGreaterThanOrEqual(1)
  })

  it('should approve the bulletin', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/measurement-bulletins/${bulletinId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: 'APPROVED' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().measurementBulletin.status).toBe('APPROVED')
  })

  // ─── Cenário 2: Criar fatura a partir da medição proporcional ───

  it('should create an invoice from the proportional bulletin', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/invoices',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        measurementBulletinId: bulletinId,
        issue_date: '2026-03-01',
        due_date: '2026-03-15',
      },
    })

    expect(response.statusCode).toBe(201)
    const invoice = response.json().invoice
    invoiceId = invoice.id

    // Invoice should inherit proportional value from bulletin: R$5.000
    expect(Number(invoice.total_value)).toBeCloseTo(5000, 2)
    expect(invoice.status).toBe('PENDING')
    expect(invoice.is_paid).toBe(false)
  })

  it('should not create duplicate invoice for same bulletin', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/invoices',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        measurementBulletinId: bulletinId,
        issue_date: '2026-03-01',
        due_date: '2026-03-15',
      },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should get invoice with correct proportional value', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/invoices/${invoiceId}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const invoice = response.json().invoice

    expect(Number(invoice.total_value)).toBeCloseTo(5000, 2)
    expect(invoice.invoice_number).toBeDefined()
  })

  it('should list invoices', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/invoices?page=1',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().items).toBeDefined()
  })

  // ─── Cenário 3: Pagamento da fatura ───

  it('should toggle invoice to PAID', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/invoices/${invoiceId}/toggle-payment`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const invoice = response.json().invoice

    expect(invoice.is_paid).toBe(true)
    expect(invoice.status).toBe('PAID')
    expect(invoice.payment_date).toBeDefined()
  })

  it('should toggle invoice back to PENDING', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/invoices/${invoiceId}/toggle-payment`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const invoice = response.json().invoice

    expect(invoice.is_paid).toBe(false)
    expect(invoice.status).toBe('PENDING')
  })

  // ─── Cenário 4: Validações de segurança ───

  it('should return 401 for bulletins without auth', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/measurement-bulletins?page=1',
    })
    expect(response.statusCode).toBe(401)
  })

  it('should return 401 for invoices without auth', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/invoices?page=1',
    })
    expect(response.statusCode).toBe(401)
  })

  // ─── Cenário 5: Exclusão em cascata (invoice → bulletin) ───

  it('should delete invoice and revert bulletin to APPROVED', async () => {
    // First check current bulletin status (should be INVOICED)
    const beforeResponse = await app.inject({
      method: 'GET',
      url: `/measurement-bulletins/${bulletinId}`,
      headers: { authorization: `Bearer ${token}` },
    })
    expect(beforeResponse.json().measurementBulletin.status).toBe(
      'INVOICED',
    )

    // Delete the invoice
    const response = await app.inject({
      method: 'DELETE',
      url: `/invoices/${invoiceId}`,
      headers: { authorization: `Bearer ${token}` },
    })
    expect(response.statusCode).toBe(204)

    // Bulletin should revert to APPROVED
    const afterResponse = await app.inject({
      method: 'GET',
      url: `/measurement-bulletins/${bulletinId}`,
      headers: { authorization: `Bearer ${token}` },
    })
    expect(afterResponse.json().measurementBulletin.status).toBe(
      'APPROVED',
    )

    // Mark as cleaned up
    invoiceId = ''
  })

  it('should delete the measurement bulletin', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/measurement-bulletins/${bulletinId}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(204)
    bulletinId = ''
  })
})

/**
 * Cenário: Aluguel DIÁRIO pontual
 * 5 dias × R$1.200/dia = R$6.000
 * billing_cycle = DAILY → rental_value É a diária
 */
describe('Measurement Bulletin E2E - Daily Billing Cycle', () => {
  let dailyToken: string
  let dailyClientId: string
  let dailyContractId: string
  let dailyCategoryId: string
  let dailyAssetId: string
  let dailyMovementId: string
  let dailyBulletinId: string
  let dailyInvoiceId: string

  beforeAll(async () => {
    await app.ready()
    dailyToken = jwt.sign(
      { sub: 'e2e-daily-user', email: 'e2e-daily@test.com', role: 'ADMIN' },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    const category = await prisma.assetCategory.create({
      data: {
        name: `E2E Daily Category ${Date.now()}`,
        type: 'EQUIPMENT',
      },
    })
    dailyCategoryId = category.id

    const asset = await prisma.asset.create({
      data: {
        brand: 'Volvo',
        model: 'Caminhão Munck',
        assetCategoryId: dailyCategoryId,
      },
    })
    dailyAssetId = asset.id

    const client = await prisma.supplier.create({
      data: {
        company_name: `E2E Daily Client ${Date.now()}`,
        cnpj: `D${Date.now()}`,
        email: 'e2e-daily@test.com',
        phone: '11777777777',
        contact: 'Daily Tester',
        isClient: true,
      },
    })
    dailyClientId = client.id

    const contract = await prisma.contract.create({
      data: {
        contract_number: `E2E-DAILY-${Date.now()}`,
        clientId: dailyClientId,
        start_date: new Date('2026-01-01'),
        status: 'ACTIVE',
      },
    })
    dailyContractId = contract.id

    // Asset movement with DAILY billing: R$1,200/day, 5-day rental
    const movement = await prisma.assetMovement.create({
      data: {
        contractId: dailyContractId,
        assetId: dailyAssetId,
        mobilization_date: new Date('2026-01-10'),
        demobilization_date: new Date('2026-01-14'),
        rental_value: 1200,
        billing_cycle: 'DAILY',
      },
    })
    dailyMovementId = movement.id
  })

  afterAll(async () => {
    await prisma.invoice
      .deleteMany({ where: { measurementBulletin: { assetMovementId: dailyMovementId } } })
      .catch(() => {})
    await prisma.measurementBulletin
      .deleteMany({ where: { assetMovementId: dailyMovementId } })
      .catch(() => {})
    await prisma.assetMovement.deleteMany({ where: { contractId: dailyContractId } })
    await prisma.contract.delete({ where: { id: dailyContractId } })
    await prisma.supplier.delete({ where: { id: dailyClientId } })
    await prisma.asset.delete({ where: { id: dailyAssetId } })
    await prisma.assetCategory.delete({ where: { id: dailyCategoryId } })
    await app.close()
  })

  it('should create bulletin with daily rate (R$1,200/dia × 5 dias = R$6,000)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/measurement-bulletins',
      headers: { authorization: `Bearer ${dailyToken}` },
      payload: {
        contractId: dailyContractId,
        assetMovementId: dailyMovementId,
        reference_start: '2026-01-10',
        reference_end: '2026-01-14',
      },
    })

    expect(response.statusCode).toBe(201)
    const bulletin = response.json().measurementBulletin
    dailyBulletinId = bulletin.id

    // DAILY billing: dailyRate = rental_value = R$1,200
    // 5 days (Mar 10-14 inclusive)
    // totalValue = 1200 × 5 = R$6,000
    expect(bulletin.total_days).toBe(5)
    expect(bulletin.working_days).toBe(5)
    expect(Number(bulletin.daily_rate)).toBeCloseTo(1200, 2)
    expect(Number(bulletin.total_value)).toBeCloseTo(6000, 2)
  })

  it('should approve and create invoice with daily value (R$6,000)', async () => {
    // Approve   
    await app.inject({
      method: 'PATCH',
      url: `/measurement-bulletins/${dailyBulletinId}`,
      headers: { authorization: `Bearer ${dailyToken}` },
      payload: { status: 'APPROVED' },
    })

    // Create invoice
    const response = await app.inject({
      method: 'POST',
      url: '/invoices',
      headers: { authorization: `Bearer ${dailyToken}` },
      payload: {
        measurementBulletinId: dailyBulletinId,
        issue_date: '2026-01-15',
        due_date: '2026-01-20',
      },
    })

    expect(response.statusCode).toBe(201)
    const invoice = response.json().invoice
    dailyInvoiceId = invoice.id

    // Invoice inherits the R$6,000 from the daily bulletin
    expect(Number(invoice.total_value)).toBeCloseTo(6000, 2)
  })

  it('should verify daily rate is different from monthly calculation', async () => {
    // If this were MONTHLY: dailyRate = 1200/30 = 40, totalValue = 40*5 = R$200
    // With DAILY: dailyRate = 1200, totalValue = 1200*5 = R$6,000
    // The difference proves the billing_cycle is being used correctly
    const response = await app.inject({
      method: 'GET',
      url: `/measurement-bulletins/${dailyBulletinId}`,
      headers: { authorization: `Bearer ${dailyToken}` },
    })

    const bulletin = response.json().measurementBulletin
    const dailyRate = Number(bulletin.daily_rate)
    const totalValue = Number(bulletin.total_value)

    // Daily rate should be R$1,200 (not R$40 as it would be with monthly)
    expect(dailyRate).toBe(1200)
    expect(totalValue).toBe(6000)
    expect(dailyRate).not.toBe(1200 / 30) // Proves it's NOT dividing by 30
  })
})
