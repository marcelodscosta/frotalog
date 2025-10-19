import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetMaintenanceByIdUseCase } from '../maintenance/get-maintenance-by-id-use-case'

export function makeGetMaintenanceById() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const getMaintenanceByIdUseCase = new GetMaintenanceByIdUseCase(maintenanceRepository)
  return getMaintenanceByIdUseCase
}
