import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { MaintenanceByAssetUseCase } from '../reports/maintenance-by-asset-use-case'

export function makeMaintenanceByAssetUseCase(): MaintenanceByAssetUseCase {
  const maintenanceRepository: IMaintenanceRepository =
    new PrismaMaintenanceRepository()
  const assetMovementRepository: IAssetMovementRepository =
    new PrismaAssetMovementRepository()
  return new MaintenanceByAssetUseCase(
    maintenanceRepository,
    assetMovementRepository,
  )
}
