import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { ListExpensesUseCase } from '../accounts-payable/list-expenses-use-case'

export function makeListExpenses() {
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  return new ListExpensesUseCase(payableExpenseRepository)
}
