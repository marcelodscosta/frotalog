import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface FindAllMaintenanceRequest {
  page: number
}

interface FindAllMaintenanceResponse {
  maintenances: Maintenance[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindAllMaintenanceUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({ page }: FindAllMaintenanceRequest): Promise<FindAllMaintenanceResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } = await this.maintenanceRepository.findAll(page)
    return {
      maintenances: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
