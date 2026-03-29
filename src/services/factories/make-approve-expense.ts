import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { ApproveExpenseUseCase } from '../accounts-payable/approve-expense-use-case'

export function makeApproveExpense() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  return new ApproveExpenseUseCase(payableExpenseRepository)
}
