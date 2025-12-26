import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'

interface UpdateMaintenanceRequest {
  id: string
  data: Prisma.MaintenanceUpdateInput
}

interface UpdateMaintenanceResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({
    id,
    data,
  }: UpdateMaintenanceRequest): Promise<UpdateMaintenanceResponse> {
    const existingMaintenance = await this.maintenanceRepository.findById(id)

    if (!existingMaintenance) {
      throw new MaintenanceNotFoundError()
    }
    console.log(
      `Estou na camada de serviço, os dados brutos recebidos: ${JSON.stringify(data)}`,
    )
    const updateData: Prisma.MaintenanceUpdateInput = {
      ...data,
    }

    if (data.actual_cost !== undefined && data.actual_cost !== null) {
      const normalized = String(data.actual_cost)
        .replace(/\./g, '')
        .replace(',', '.')
      const num = Number(normalized)

      if (!Number.isNaN(num)) {
        updateData.actual_cost = num
      } else {
        updateData.actual_cost = null
      }
    }

    if (data.actual_cost !== undefined && data.actual_cost !== null) {
      const normalized = String(data.actual_cost)
        .replace(/\./g, '')
        .replace(',', '.')
      const num = Number(normalized)

      if (!Number.isNaN(num)) {
        updateData.actual_cost = num
      } else {
        updateData.actual_cost = null
      }
    }

    if (data.estimated_cost !== undefined && data.estimated_cost !== null) {
      const normalized = String(data.estimated_cost)
        .replace(/\./g, '')
        .replace(',', '.')
      const num = Number(normalized)

      if (!Number.isNaN(num)) {
        updateData.estimated_cost = num
      } else {
        updateData.estimated_cost = null
      }
    }

    if (data.completed_date !== undefined || data.completed_date !== null) {
      updateData.completed_date = data.completed_date
    }

    console.log(
      `Estou na camada de serviço os dados trabalhados: ${JSON.stringify(updateData)}`,
    )
    const maintenance = await this.maintenanceRepository.updateMaintenance(
      id,
      updateData,
    )

    return { maintenance }
  }
}
