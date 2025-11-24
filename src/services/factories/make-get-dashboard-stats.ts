import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { GetDashboardStatsUseCase } from '../dashboard/get-dashboard-stats-use-case'

export function makeGetDashboardStats() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()
  const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
    maintenanceRepository,
    assetRepository,
  )

  return getDashboardStatsUseCase
}

