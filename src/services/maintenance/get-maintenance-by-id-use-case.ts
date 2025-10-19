import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'

interface GetMaintenanceByIdRequest {
  id: string
}

interface GetMaintenanceByIdResponse {
  maintenance: Maintenance
}

export class GetMaintenanceByIdUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({ id }: GetMaintenanceByIdRequest): Promise<GetMaintenanceByIdResponse> {
    const maintenance = await this.maintenanceRepository.findById(id)

    if (!maintenance) {
      throw new MaintenanceNotFoundError()
    }

    return { maintenance }
  }
}
