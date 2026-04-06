import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

let token: string
let supplierId: string
let assetId: string
let bankAccountId: string
let chartOfAccountId: string

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Accounts Payable E2E', () => {
  beforeAll(async () => {
    await app.ready()
    token = generateToken()

    // 1. Setup Supplier
    const supplier = await prisma.supplier.create({
      data: {
        company_name: 'E2E Finance Supplier',
        cnpj: `00${Date.now()}00`.slice(0, 14),
        email: 'finance-e2e@supplier.com',
        phone: '11988888888',
        contact: 'E2E Contact',
        isClient: false,
      },
    })
    supplierId = supplier.id

    // 2. Setup Bank Account
    const bankAccount = await prisma.bankAccount.create({
      data: {
        name: 'E2E Test Bank',
        balance: 10000,
      },
    })
    bankAccountId = bankAccount.id

    // 3. Setup Chart of Account (Category)
    const chartAccount = await prisma.chartOfAccount.create({
      data: {
        code: `E2E-${Date.now()}`,
        name: 'E2E Expense Category',
        type: 'EXPENSE',
      },
    })
    chartOfAccountId = chartAccount.id
  })

  afterAll(async () => {
    // Cleanup using deleteMany for safety if setup failed
    await prisma.financialTransaction.deleteMany({ where: { description: { contains: 'E2E' } } })
    await prisma.expenseInstallment.deleteMany({ where: { payableExpense: { description: { contains: 'E2E' } } } })
    await prisma.payableExpense.deleteMany({ where: { description: { contains: 'E2E' } } })
    
    if (bankAccountId) await prisma.bankAccount.deleteMany({ where: { id: bankAccountId } })
    if (supplierId) await prisma.supplier.deleteMany({ where: { id: supplierId } })
    if (chartOfAccountId) await prisma.chartOfAccount.deleteMany({ where: { id: chartOfAccountId } })
    
    await app.close()
  })

  it('POST /expenses - should create a single installment expense', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/expenses',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        description: 'E2E Single Expense',
        total_value: 150.50,
        payment_method: 'BOLETO',
        chartOfAccountId,
        supplierId,
        installments: [
          {
            installment_number: 1,
            value: 150.50,
            due_date: new Date().toISOString(),
          },
        ],
      },
    })

    console.log(response.json()); expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.expense.description).toBe('E2E Single Expense')
    expect(body.expense.installments).toHaveLength(1)
  })

  it('POST /expenses - should create a multi-installment expense', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/expenses',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        description: 'E2E Multi Expense',
        total_value: 300,
        payment_method: 'PIX',
        chartOfAccountId,
        supplierId,
        installments: [
          { installment_number: 1, value: 150, due_date: new Date().toISOString() },
          { installment_number: 2, value: 150, due_date: new Date().toISOString() },
        ],
      },
    })

    console.log(response.json()); expect(response.statusCode).toBe(201)
    expect(response.json().expense.installments).toHaveLength(2)
  })

  it('PATCH /expenses/:id - should edit an expense', async () => {
    // 1. Create one
    const createResponse = await app.inject({
      method: 'POST',
      url: '/expenses',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        description: 'To Edit',
        total_value: 100,
        payment_method: 'DINHEIRO',
        installments: [{ installment_number: 1, value: 100, due_date: new Date().toISOString() }],
      },
    })
    const expenseId = createResponse.json().expense.id

    // 2. Edit it
    const response = await app.inject({
      method: 'PATCH',
      url: `/expenses/${expenseId}`,
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        description: 'Edited Description',
        total_value: 120, // New logic permits total_value update
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().expense.description).toBe('Edited Description')
    expect(Number(response.json().expense.total_value)).toBe(120)
  })

  it('POST /expenses/installments/:id/pay - should pay an installment', async () => {
    // 1. Create an expense
    const createResponse = await app.inject({
      method: 'POST',
      url: '/expenses',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        description: 'To Pay',
        total_value: 50,
        payment_method: 'TRANSFERENCIA',
        installments: [{ installment_number: 1, value: 50, due_date: new Date().toISOString() }],
      },
    })
    const installmentId = createResponse.json().expense.installments[0].id

    // 2. Pay it
    const response = await app.inject({
      method: 'POST',
      url: `/expenses/installments/${installmentId}/pay`,
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        bankAccountId,
        payment_date: new Date().toISOString(),
        description: 'Payment E2E',
      },
    })

    console.log(response.json()); expect(response.statusCode).toBe(201)
    
    // 3. Check bank balance reduction
    const bankAccount = await prisma.bankAccount.findUnique({ where: { id: bankAccountId } })
    // Initial was 10000, paid 50
    expect(Number(bankAccount?.balance)).toBe(9950)
  })
})
