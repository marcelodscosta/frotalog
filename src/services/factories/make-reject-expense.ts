import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { RejectExpenseUseCase } from '../accounts-payable/reject-expense-use-case'

export function makeRejectExpense() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  return new RejectExpenseUseCase(payableExpenseRepository)
}
