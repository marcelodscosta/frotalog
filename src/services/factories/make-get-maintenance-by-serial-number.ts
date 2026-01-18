import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetMaintenanceBySerialNumberUseCase } from '../maintenance/get-maintenance-by-serial-number-use-case'

export function makeGetMaintenanceBySerialNumber() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const getMaintenanceBySerialNumberUseCase =
    new GetMaintenanceBySerialNumberUseCase(maintenanceRepository)
  return getMaintenanceBySerialNumberUseCase
}
