import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FindAllMaintenanceRequest {
  page: number
}

interface FindAllMaintenanceResponse {
  maintenances: PaginatedResult<Maintenance>
}

export class FindAllMaintenanceUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({ page }: FindAllMaintenanceRequest): Promise<FindAllMaintenanceResponse> {
    const maintenances = await this.maintenanceRepository.findAll(page)
    return { maintenances }
  }
}
