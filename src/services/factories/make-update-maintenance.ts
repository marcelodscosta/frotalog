import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { UpdateMaintenanceUseCase } from '../maintenance/update-maintenance-use-case'

export function makeUpdateMaintenance() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const updateMaintenanceUseCase = new UpdateMaintenanceUseCase(maintenanceRepository)
  return updateMaintenanceUseCase
}

