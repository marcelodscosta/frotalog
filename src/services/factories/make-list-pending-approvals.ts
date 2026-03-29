import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { ListPendingApprovalsUseCase } from '../accounts-payable/list-pending-approvals-use-case'

export function makeListPendingApprovals() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  return new ListPendingApprovalsUseCase(payableExpenseRepository)
}
