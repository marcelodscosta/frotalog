import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetMaintenanceByPlateUseCase } from '../maintenance/get-maintenance-by-plate-use-case'

export function makeGetMaintenanceByPlate() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const getMaintenanceByPlateUseCase = new GetMaintenanceByPlateUseCase(
    maintenanceRepository,
  )
  return getMaintenanceByPlateUseCase
}
