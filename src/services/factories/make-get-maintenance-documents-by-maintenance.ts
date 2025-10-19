import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { GetMaintenanceDocumentsByMaintenanceUseCase } from '../maintenance-document/get-maintenance-documents-by-maintenance-use-case'

export function makeGetMaintenanceDocumentsByMaintenance() {
  const maintenanceDocumentRepository = new PrismaMaintenanceDocumentRepository()
  const getMaintenanceDocumentsByMaintenanceUseCase = new GetMaintenanceDocumentsByMaintenanceUseCase(maintenanceDocumentRepository)
  return getMaintenanceDocumentsByMaintenanceUseCase
}
