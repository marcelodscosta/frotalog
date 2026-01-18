import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { FindAllMaintenanceUseCase } from '../maintenance/find-all-maintenance-use-case'

export function makeFindAllMaintenance() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const findAllMaintenanceUseCase = new FindAllMaintenanceUseCase(
    maintenanceRepository,
  )
  return findAllMaintenanceUseCase
}
