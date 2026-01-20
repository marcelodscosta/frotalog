import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository' // ✅ ADICIONAR
import { UpdateMaintenanceUseCase } from '../maintenance/update-maintenance-use-case'

export function makeUpdateMaintenance() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()

  const updateMaintenanceUseCase = new UpdateMaintenanceUseCase(
    maintenanceRepository,
    serviceCategoryRepository,
  )

  return updateMaintenanceUseCase
}
