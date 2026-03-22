import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { UpdateMaintenanceDocumentUseCase } from '../maintenance-document/update-maintenance-document-use-case'

export function makeUpdateMaintenanceDocument() {
  const maintenanceDocumentRepository =
    new PrismaMaintenanceDocumentRepository()
  const useCase = new UpdateMaintenanceDocumentUseCase(
    maintenanceDocumentRepository,
  )

  return useCase
}
