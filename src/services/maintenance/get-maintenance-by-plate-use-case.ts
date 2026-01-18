import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface GetMaintenanceByPlateRequest {
  plate: string
  page: number
}

interface GetMaintenanceByPlateResponse {
  maintenances: Maintenance[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class GetMaintenanceByPlateUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({
    plate,
    page,
  }: GetMaintenanceByPlateRequest): Promise<GetMaintenanceByPlateResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.maintenanceRepository.findMaintenancesByPlate(plate, page)

    return {
      maintenances: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
