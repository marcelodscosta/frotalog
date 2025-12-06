import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'

interface UpdateMaintenanceRequest {
  id: string
  data: {
    actual_cost?: number
    completed_date?: Date
    document_link?: string | null
    notes?: string | null
  }
}

interface UpdateMaintenanceResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({ id, data }: UpdateMaintenanceRequest): Promise<UpdateMaintenanceResponse> {
    const existingMaintenance = await this.maintenanceRepository.findById(id)

    if (!existingMaintenance) {
      throw new MaintenanceNotFoundError()
    }

    const updateData: Prisma.MaintenanceUpdateInput = {}

    if (data.actual_cost !== undefined) {
      updateData.actual_cost = data.actual_cost
    }

    if (data.completed_date !== undefined) {
      updateData.completed_date = data.completed_date
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }

    if (data.document_link !== undefined) {
      updateData.document_link = data.document_link
    }

    const maintenance = await this.maintenanceRepository.updateMaintenance(id, updateData)

    return { maintenance }
  }
}

