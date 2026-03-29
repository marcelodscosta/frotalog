import { PrismaBankAccountRepository } from '../../repositories/prisma/prisma-bank-account-repository'
import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { PrismaFinancialTransactionRepository } from '../../repositories/prisma/prisma-financial-transaction-repository'
import { PayInstallmentUseCase } from '../accounts-payable/pay-installment-use-case'

export function makePayInstallment() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  const bankAccountRepository = new PrismaBankAccountRepository()
  const financialTransactionRepository = new PrismaFinancialTransactionRepository()
  return new PayInstallmentUseCase(payableExpenseRepository, bankAccountRepository, financialTransactionRepository)
}
