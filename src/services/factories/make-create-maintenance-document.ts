import { PrismaMaintenanceDocumentRepository } from '../../repositories/prisma/prisma-maintenance-document-repository'
import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { CreateMaintenanceDocumentUseCase } from '../maintenance-document/create-maintenance-document-use-case'

export function makeCreateMaintenanceDocument() {
  const maintenanceDocumentRepository = new PrismaMaintenanceDocumentRepository()
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const createMaintenanceDocumentUseCase = new CreateMaintenanceDocumentUseCase(
    maintenanceDocumentRepository,
    maintenanceRepository,
  )
  return createMaintenanceDocumentUseCase
}
