
import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { CreateQuickMaintenanceUseCase } from '../maintenance/create-quick-maintenance-use-case'

export function makeCreateQuickMaintenance() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()

  const createQuickMaintenanceUseCase = new CreateQuickMaintenanceUseCase(
    maintenanceRepository,
    assetRepository,
  )

  return createQuickMaintenanceUseCase
}
