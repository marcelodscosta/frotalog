import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface GetMaintenanceByStatusRequest {
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  page: number
}

interface GetMaintenanceByStatusResponse {
  maintenances: Maintenance[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class GetMaintenanceByStatusUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}
  async execute({
    status,
    page,
  }: GetMaintenanceByStatusRequest): Promise<GetMaintenanceByStatusResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.maintenanceRepository.findByStatus(status, page)
    return {
      maintenances: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
