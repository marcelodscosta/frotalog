import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { DeleteMaintenanceDocumentUseCase } from '../maintenance-document/delete-maintenance-document-use-case'

export function makeDeleteMaintenanceDocument() {
  const maintenanceDocumentRepository = new PrismaMaintenanceDocumentRepository()
  const deleteMaintenanceDocumentUseCase = new DeleteMaintenanceDocumentUseCase(maintenanceDocumentRepository)
  return deleteMaintenanceDocumentUseCase
}
