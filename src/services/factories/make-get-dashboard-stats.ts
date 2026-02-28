import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { GetDashboardStatsUseCase } from '../dashboard/get-dashboard-stats-use-case'

export function makeGetDashboardStats() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()
  const assetMovementRepository = new PrismaAssetMovementRepository()
  
  const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
    maintenanceRepository,
    assetRepository,
    assetMovementRepository
  )

  return getDashboardStatsUseCase
}

