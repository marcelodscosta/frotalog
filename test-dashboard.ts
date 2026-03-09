import { prisma } from './src/lib/prisma'
import { GetDashboardStatsUseCase } from './src/services/dashboard/get-dashboard-stats-use-case'
import { PrismaMaintenanceRepository } from './src/repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from './src/repositories/prisma/prisma-asset-repository'
import { PrismaAssetMovementRepository } from './src/repositories/prisma/prisma-asset-moviment-repository'

async function run() {
  const maintenanceRepository = new PrismaMaintenanceRepository(prisma)
  const assetRepository = new PrismaAssetRepository(prisma)
  const assetMovementRepository = new PrismaAssetMovementRepository(prisma)

  const useCase = new GetDashboardStatsUseCase(
    maintenanceRepository,
    assetRepository,
    assetMovementRepository
  )

  try {
    const stats = await useCase.execute({ month: 3, year: 2026 })
    console.dir(stats.equipmentMaintenanceDetails, { depth: null })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

run()
