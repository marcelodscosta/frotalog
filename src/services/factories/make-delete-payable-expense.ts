import { PrismaPayableExpenseRepository } from '../repositories/prisma/prisma-payable-expense-repository'
import { PrismaBankAccountRepository } from '../repositories/prisma/prisma-bank-account-repository'
import { PrismaFinancialTransactionRepository } from '../repositories/prisma/prisma-financial-transaction-repository'
import { DeletePayableExpenseUseCase } from './accounts-payable/delete-expense-use-case'

export function makeDeletePayableExpense() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  const bankAccountRepository = new PrismaBankAccountRepository()
  const financialTransactionRepository = new PrismaFinancialTransactionRepository()
  const useCase = new DeletePayableExpenseUseCase(
    payableExpenseRepository,
    bankAccountRepository,
    financialTransactionRepository,
  )

  return useCase
}
