import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'
import { InvalidMaintenanceStatusError } from '../errors/invalid-maintenance-status-error'

interface UpdateMaintenanceStatusRequest {
  id: string
  status: Prisma.MaintenanceStatus
}

interface UpdateMaintenanceStatusResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceStatusUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({ id, status }: UpdateMaintenanceStatusRequest): Promise<UpdateMaintenanceStatusResponse> {
    const maintenance = await this.maintenanceRepository.findById(id)

    if (!maintenance) {
      throw new MaintenanceNotFoundError()
    }

    // Validar transições de status
    const validTransitions: Record<Prisma.MaintenanceStatus, Prisma.MaintenanceStatus[]> = {
      SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // Não pode mudar de COMPLETED
      CANCELLED: [], // Não pode mudar de CANCELLED
    }

    if (!validTransitions[maintenance.status].includes(status)) {
      throw new InvalidMaintenanceStatusError()
    }

    const updatedMaintenance = await this.maintenanceRepository.updateStatus(id, status)

    return { maintenance: updatedMaintenance }
  }
}
