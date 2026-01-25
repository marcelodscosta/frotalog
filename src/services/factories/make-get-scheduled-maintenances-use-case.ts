import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetScheduledMaintenancesUseCase } from '../maintenance/get-scheduled-maintenances-use-case'

export function makeGetScheduledMaintenancesUseCase() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const useCase = new GetScheduledMaintenancesUseCase(maintenanceRepository)

  return useCase
}
