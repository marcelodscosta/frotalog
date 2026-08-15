import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { UpdateMaintenanceStatusUseCase } from '../maintenance/update-maintenance-status-use-case'

export function makeUpdateMaintenanceStatus() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()
  const updateMaintenanceStatusUseCase = new UpdateMaintenanceStatusUseCase(
    maintenanceRepository,
    assetRepository
  )
  return updateMaintenanceStatusUseCase
}
