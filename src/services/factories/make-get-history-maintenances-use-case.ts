import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { GetHistoryMaintenancesUseCase } from '../maintenance/get-history-maintenances-use-case'

export function makeGetHistoryMaintenancesUseCase() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const useCase = new GetHistoryMaintenancesUseCase(maintenanceRepository)

  return useCase
}
