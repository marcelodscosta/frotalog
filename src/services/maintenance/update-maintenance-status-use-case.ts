import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'

interface UpdateMaintenanceStatusRequest {
  id: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

interface UpdateMaintenanceStatusResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceStatusUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({
    id,
    status,
  }: UpdateMaintenanceStatusRequest): Promise<UpdateMaintenanceStatusResponse> {
    const maintenance = await this.maintenanceRepository.findById(id)

    if (!maintenance) {
      throw new MaintenanceNotFoundError()
    }

    if (status !== 'COMPLETED') {
      await this.maintenanceRepository.updateCompletedDate(id)
    }

    const updatedMaintenance = await this.maintenanceRepository.updateStatus(
      id,
      status,
    )

    return { maintenance: updatedMaintenance }
  }
}
