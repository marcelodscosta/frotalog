import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { UpdateMaintenanceStatusUseCase } from '../maintenance/update-maintenance-status-use-case'

export function makeUpdateMaintenanceStatus() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const updateMaintenanceStatusUseCase = new UpdateMaintenanceStatusUseCase(maintenanceRepository)
  return updateMaintenanceStatusUseCase
}
