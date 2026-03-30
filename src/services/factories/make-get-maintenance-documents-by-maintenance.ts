import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { GetMaintenanceDocumentsByMaintenanceUseCase } from '../maintenance-document/get-maintenance-documents-by-maintenance-use-case'

export function makeGetMaintenanceDocumentsByMaintenance() {
  const maintenanceDocumentRepository = new PrismaMaintenanceDocumentRepository()
  const payableExpenseRepository = new PrismaPayableExpenseRepository()
  const getMaintenanceDocumentsByMaintenanceUseCase = new GetMaintenanceDocumentsByMaintenanceUseCase(
    maintenanceDocumentRepository,
    payableExpenseRepository,
  )
  return getMaintenanceDocumentsByMaintenanceUseCase
}
