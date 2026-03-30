import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { CreateExpenseDocumentUseCase } from '../accounts-payable/create-expense-document-use-case'

export function makeCreateExpenseDocument() {
  const expenseRepository = new PrismaPayableExpenseRepository()
  const useCase = new CreateExpenseDocumentUseCase(expenseRepository)

  return useCase
}
