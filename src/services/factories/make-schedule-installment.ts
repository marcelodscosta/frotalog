import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { ScheduleInstallmentUseCase } from '../accounts-payable/schedule-installment-use-case'

export function makeScheduleInstallment() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  const useCase = new ScheduleInstallmentUseCase(payableExpenseRepository)
  return useCase
}
