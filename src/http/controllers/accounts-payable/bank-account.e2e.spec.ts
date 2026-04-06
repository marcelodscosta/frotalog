import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

let token: string
const createdBankAccountIds: string[] = []

function generateToken() {
  return jwt.sign(
    { sub: 'e2e-test-user', email: 'e2e@test.com', role: 'ADMIN' },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
}

describe('Bank Account & Transfers E2E', () => {
  beforeAll(async () => {
    await app.ready()
    token = generateToken()
  })

  afterAll(async () => {
    await prisma.financialTransaction.deleteMany({ where: { description: { contains: 'E2E' } } })
    await prisma.expenseInstallment.deleteMany({ where: { payableExpense: { description: { contains: 'E2E' } } } })
    await prisma.payableExpense.deleteMany({ where: { description: { contains: 'E2E' } } })
    if (createdBankAccountIds.length > 0) {
      await prisma.bankAccount.deleteMany({ where: { id: { in: createdBankAccountIds } } })
    }
    await app.close()
  })

  it('POST /bank-accounts - should create multiple bank accounts', async () => {
    const accounts = [
      { name: 'E2E Main Account', balance: 5000 },
      { name: 'E2E Savings Account', balance: 1000 },
      { name: 'E2E Operating Account', balance: 2500 },
    ]

    for (const data of accounts) {
      const response = await app.inject({
        method: 'POST',
        url: '/bank-accounts',
        headers: { Authorization: `Bearer ${token}` },
        payload: data,
      })
      expect(response.statusCode).toBe(201)
      expect(response.json().bankAccount.name).toBe(data.name)
      createdBankAccountIds.push(response.json().bankAccount.id)
    }
  })

  it('GET /bank-accounts - should list all accounts', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/bank-accounts',
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.bankAccounts.length).toBeGreaterThanOrEqual(3)
  })

  it('POST /expenses/installments/:id/pay - should update balance restricted to the chosen account', async () => {
    // 1. Find the Main account
    const accounts = await prisma.bankAccount.findMany({ where: { name: 'E2E Main Account' } })
    const mainAccount = accounts[0]
    const initialBalance = Number(mainAccount.balance)

    // 2. Create an expense
    const createResponse = await app.inject({
      method: 'POST',
      url: '/expenses',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        description: 'E2E Payment Test',
        total_value: 200,
        payment_method: 'BOLETO',
        installments: [{ installment_number: 1, value: 200, due_date: new Date().toISOString() }],
      },
    })
    const installmentId = createResponse.json().expense.installments[0].id

    // 3. Pay using Main Account
    const response = await app.inject({
      method: 'POST',
      url: `/expenses/installments/${installmentId}/pay`,
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        bankAccountId: mainAccount.id,
        payment_date: new Date().toISOString(),
        description: 'E2E Payment Baixa',
      },
    })

    expect(response.statusCode).toBe(201)

    // 4. Verify balance
    const updatedAccount = await prisma.bankAccount.findUnique({ where: { id: mainAccount.id } })
    expect(Number(updatedAccount?.balance)).toBe(initialBalance - 200)

    // 5. Verify other account was NOT affected
    const savingsAccount = (await prisma.bankAccount.findMany({ where: { name: 'E2E Savings Account' } }))[0]
    expect(Number(savingsAccount.balance)).toBe(1000)
  })

  it('POST /bank-accounts/transfer - should transfer balance between accounts', async () => {
    // 1. Get accounts
    const mainAccount = (await prisma.bankAccount.findMany({ where: { name: 'E2E Main Account' } }))[0]
    const savingsAccount = (await prisma.bankAccount.findMany({ where: { name: 'E2E Savings Account' } }))[0]
    
    const initialMainBalance = Number(mainAccount.balance)
    const initialSavingsBalance = Number(savingsAccount.balance)
    const transferAmount = 500

    // 2. Perform transfer
    const response = await app.inject({
      method: 'POST',
      url: '/bank-accounts/transfer',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        fromBankAccountId: mainAccount.id,
        toBankAccountId: savingsAccount.id,
        amount: transferAmount,
        description: 'E2E Internal Transfer',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json().message).toBe('Transferência realizada com sucesso')

    // 3. Verify balances
    const updatedMain = await prisma.bankAccount.findUnique({ where: { id: mainAccount.id } })
    const updatedSavings = await prisma.bankAccount.findUnique({ where: { id: savingsAccount.id } })

    expect(Number(updatedMain?.balance)).toBe(initialMainBalance - transferAmount)
    expect(Number(updatedSavings?.balance)).toBe(initialSavingsBalance + transferAmount)

    // 4. Verify Transactions
    const transactions = await prisma.financialTransaction.findMany({
      where: { description: 'E2E Internal Transfer' }
    })
    expect(transactions).toHaveLength(2)
    const expenseTx = transactions.find(t => t.type === 'EXPENSE')
    const incomeTx = transactions.find(t => t.type === 'INCOME')
    
    expect(Number(expenseTx?.amount)).toBe(transferAmount)
    expect(expenseTx?.bankAccountId).toBe(mainAccount.id)
    
    expect(Number(incomeTx?.amount)).toBe(transferAmount)
    expect(incomeTx?.bankAccountId).toBe(savingsAccount.id)
  })

  it('POST /bank-accounts/transfer - should fail if source and destination are the same', async () => {
    const mainAccount = (await prisma.bankAccount.findMany({ where: { name: 'E2E Main Account' } }))[0]
    
    const response = await app.inject({
      method: 'POST',
      url: '/bank-accounts/transfer',
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        fromBankAccountId: mainAccount.id,
        toBankAccountId: mainAccount.id,
        amount: 100,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().message).toBe('Conta de origem e destino devem ser diferentes')
  })
})
