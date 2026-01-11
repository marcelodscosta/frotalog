import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { MaintenanceByAssetUseCase } from '../reports/maintenance-by-asset-use-case'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

export function makeMaintenanceByAssetUseCase(): MaintenanceByAssetUseCase {
  const maintenanceRepository: IMaintenanceRepository =
    new PrismaMaintenanceRepository()
  return new MaintenanceByAssetUseCase(maintenanceRepository)
}
