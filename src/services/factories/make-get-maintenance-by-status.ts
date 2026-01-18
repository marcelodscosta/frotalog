import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetMaintenanceByStatusUseCase } from '../maintenance/get-maintenance-status-use-case'

export function makeGetMaintenanceByStatus() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const getMaintenanceByStatusUseCase = new GetMaintenanceByStatusUseCase(
    maintenanceRepository,
  )
  return getMaintenanceByStatusUseCase
}
