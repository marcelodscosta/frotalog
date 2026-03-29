import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { LaunchExpenseUseCase } from '../accounts-payable/launch-expense-use-case'

export function makeLaunchExpense() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  const maintenanceRepository = new PrismaMaintenanceRepository()
  return new LaunchExpenseUseCase(payableExpenseRepository, maintenanceRepository)
}
