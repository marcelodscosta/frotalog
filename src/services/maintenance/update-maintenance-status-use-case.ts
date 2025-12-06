import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'
import { InvalidMaintenanceStatusError } from '../errors/invalid-maintenance-status-error'

interface UpdateMaintenanceStatusRequest {
  id: string
  status: Prisma.MaintenanceStatus
  actual_cost?: number
}

interface UpdateMaintenanceStatusResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceStatusUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({ id, status, actual_cost }: UpdateMaintenanceStatusRequest): Promise<UpdateMaintenanceStatusResponse> {
    const maintenance = await this.maintenanceRepository.findById(id)

    if (!maintenance) {
      throw new MaintenanceNotFoundError()
    }

    // Validar transições de status (permitindo retornar a status anteriores)
    const validTransitions: Record<Prisma.MaintenanceStatus, Prisma.MaintenanceStatus[]> = {
      SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED', 'SCHEDULED'], // Pode retornar para SCHEDULED
      COMPLETED: ['IN_PROGRESS', 'CANCELLED'], // Pode retornar para IN_PROGRESS
      CANCELLED: ['SCHEDULED'], // Pode retornar para SCHEDULED
    }

    if (!validTransitions[maintenance.status].includes(status)) {
      throw new InvalidMaintenanceStatusError()
    }

    // Se mudando para COMPLETED e tem actual_cost, atualizar o custo
    let updatedMaintenance: Maintenance
    if (status === 'COMPLETED' && actual_cost !== undefined) {
      updatedMaintenance = await this.maintenanceRepository.updateCosts(id, undefined, actual_cost)
      // Depois atualizar o status
      updatedMaintenance = await this.maintenanceRepository.updateStatus(id, status)
    } else {
      updatedMaintenance = await this.maintenanceRepository.updateStatus(id, status)
    }

    return { maintenance: updatedMaintenance }
  }
}
