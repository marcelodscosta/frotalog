import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { CreateMaintenanceUseCase } from '../maintenance/create-maintenance-use-case'

export function makeCreateMaintenance() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()
  const supplierRepository = new PrismaSupplierRepository()
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()

  const createMaintenanceUseCase = new CreateMaintenanceUseCase(
    maintenanceRepository,
    assetRepository,
    supplierRepository,
    serviceCategoryRepository,
  )

  return createMaintenanceUseCase
}
