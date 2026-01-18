import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetMaintenanceByTypeUseCase } from '../maintenance/get-maintenance-type-use-case'

export function makeGetMaintenanceByType() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const getMaintenanceByTypeUseCase = new GetMaintenanceByTypeUseCase(
    maintenanceRepository,
  )
  return getMaintenanceByTypeUseCase
}
