import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface GetMaintenanceBySerialNumberRequest {
  serialNumber: string
  page: number
}

interface GetMaintenanceBySerialNumberResponse {
  maintenances: Maintenance[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class GetMaintenanceBySerialNumberUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({
    serialNumber,
    page,
  }: GetMaintenanceBySerialNumberRequest): Promise<GetMaintenanceBySerialNumberResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.maintenanceRepository.findMaintenancesBySerialNumber(
        serialNumber,
        page,
      )

    return {
      maintenances: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
