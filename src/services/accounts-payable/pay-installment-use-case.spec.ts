import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPayableExpenseRepository } from '../../repositories/in-memory/in-memory-payable-expense-repository'
import { InMemoryBankAccountRepository } from '../../repositories/in-memory/in-memory-bank-account-repository'
import { InMemoryFinancialTransactionRepository } from '../../repositories/in-memory/in-memory-financial-transaction-repository'
import { PayInstallmentUseCase } from './pay-installment-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let payableExpenseRepository: InMemoryPayableExpenseRepository
let bankAccountRepository: InMemoryBankAccountRepository
let financialTransactionRepository: InMemoryFinancialTransactionRepository
let sut: PayInstallmentUseCase

describe('Pay Installment Use Case', () => {
  beforeEach(() => {
    payableExpenseRepository = new InMemoryPayableExpenseRepository()
    bankAccountRepository = new InMemoryBankAccountRepository()
    financialTransactionRepository = new InMemoryFinancialTransactionRepository()
    sut = new PayInstallmentUseCase(
      payableExpenseRepository,
      bankAccountRepository,
      financialTransactionRepository,
    )
  })

  it('should be able to pay an installment', async () => {
    // 1. Create a Bank Account
    const bankAccount = await bankAccountRepository.create({
      name: 'Test Bank',
      balance: 1000,
    })

    // 2. Create an Expense with 1 installment
    const expense = await payableExpenseRepository.create({
      description: 'Test Expense',
      total_value: 100,
      payment_method: 'BOLETO',
      installments: [
        { installment_number: 1, value: 100, due_date: new Date() },
      ],
    })

    const installmentId = expense.installments[0].id

    // 3. Execute payment
    const { transaction } = await sut.execute({
      installmentId,
      bankAccountId: bankAccount.id,
      payment_date: new Date(),
      description: 'Monthly Payment',
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(Number(transaction.amount)).toEqual(100)
    
    // 4. Verify installment status
    const updatedInstallment = await payableExpenseRepository.findInstallmentById(installmentId)
    expect(updatedInstallment?.status).toEqual('PAID')

    // 5. Verify bank balance
    const updatedBankAccount = await bankAccountRepository.findById(bankAccount.id)
    expect(Number(updatedBankAccount?.balance)).toEqual(900)

    // 6. Verify parent expense status
    const updatedExpense = await payableExpenseRepository.findById(expense.id)
    expect(updatedExpense?.status).toEqual('PAID')
  })

  it('should update expense status to PARTIALLY_PAID if some installments remain', async () => {
    const bankAccount = await bankAccountRepository.create({ name: 'Bank', balance: 1000 })
    
    const expense = await payableExpenseRepository.create({
      description: 'Split Expense',
      total_value: 200,
      payment_method: 'PIX',
      installments: [
        { installment_number: 1, value: 100, due_date: new Date() },
        { installment_number: 2, value: 100, due_date: new Date() },
      ],
    })

    await sut.execute({
      installmentId: expense.installments[0].id,
      bankAccountId: bankAccount.id,
      payment_date: new Date(),
    })

    const updatedExpense = await payableExpenseRepository.findById(expense.id)
    expect(updatedExpense?.status).toEqual('PARTIALLY_PAID')
  })

  it('should not be able to pay an unpaid installment twice', async () => {
    const bankAccount = await bankAccountRepository.create({ name: 'Bank', balance: 1000 })
    const expense = await payableExpenseRepository.create({
      description: 'Test', total_value: 50, payment_method: 'BOLETO',
      installments: [{ installment_number: 1, value: 50, due_date: new Date() }]
    })

    await sut.execute({
      installmentId: expense.installments[0].id,
      bankAccountId: bankAccount.id,
      payment_date: new Date(),
    })

    await expect(() =>
      sut.execute({
        installmentId: expense.installments[0].id,
        bankAccountId: bankAccount.id,
        payment_date: new Date(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should throw an error if bank account does not exist', async () => {
    const expense = await payableExpenseRepository.create({
      description: 'Test', total_value: 50, payment_method: 'BOLETO',
      installments: [{ installment_number: 1, value: 50, due_date: new Date() }]
    })

    await expect(() =>
      sut.execute({
        installmentId: expense.installments[0].id,
        bankAccountId: 'non-existing-id',
        payment_date: new Date(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
