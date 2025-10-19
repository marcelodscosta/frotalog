import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { GetMaintenanceDocumentByIdUseCase } from '../maintenance-document/get-maintenance-document-by-id-use-case'

export function makeGetMaintenanceDocumentById() {
  const maintenanceDocumentRepository = new PrismaMaintenanceDocumentRepository()
  const getMaintenanceDocumentByIdUseCase = new GetMaintenanceDocumentByIdUseCase(maintenanceDocumentRepository)
  return getMaintenanceDocumentByIdUseCase
}
