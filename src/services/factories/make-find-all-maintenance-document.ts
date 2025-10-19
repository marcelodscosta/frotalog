import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { FindAllMaintenanceDocumentUseCase } from '../maintenance-document/find-all-maintenance-document-use-case'

export function makeFindAllMaintenanceDocument() {
  const maintenanceDocumentRepository = new PrismaMaintenanceDocumentRepository()
  const findAllMaintenanceDocumentUseCase = new FindAllMaintenanceDocumentUseCase(maintenanceDocumentRepository)
  return findAllMaintenanceDocumentUseCase
}
