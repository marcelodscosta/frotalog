import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface FindAllMaintenanceRequest {
  page: number
  status?: string
  type?: string
  plate?: string
  serialNumber?: string
  contractStatus?: string
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

  async execute(params: FindAllMaintenanceRequest): Promise<FindAllMaintenanceResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.maintenanceRepository.findAll(params)
    return {
      maintenances: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
