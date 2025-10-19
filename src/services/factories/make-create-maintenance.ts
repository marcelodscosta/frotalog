import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { CreateMaintenanceUseCase } from '../maintenance/create-maintenance-use-case'

export function makeCreateMaintenance() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()
  const supplierRepository = new PrismaSupplierRepository()
  const createMaintenanceUseCase = new CreateMaintenanceUseCase(
    maintenanceRepository,
    assetRepository,
    supplierRepository,
  )
  return createMaintenanceUseCase
}
