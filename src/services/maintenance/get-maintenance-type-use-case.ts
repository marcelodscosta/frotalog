import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface GetMaintenanceByTypeRequest {
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY'
  page: number
}

interface GetMaintenanceByTypeResponse {
  maintenances: Maintenance[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class GetMaintenanceByTypeUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}
  async execute({
    type,
    page,
  }: GetMaintenanceByTypeRequest): Promise<GetMaintenanceByTypeResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.maintenanceRepository.findByType(type, page)
    return {
      maintenances: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
