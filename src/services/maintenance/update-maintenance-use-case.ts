import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository' // ✅ NOVO
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'
import { ServiceCategoryNotFoundError } from '../errors/service-category-not-found-error' // ✅ NOVO

interface UpdateMaintenanceRequest {
  id: string
  data: Prisma.MaintenanceUpdateInput
  serviceCategoryId?: string | null // ✅ NOVO - permite atualizar ou remover categoria
}

interface UpdateMaintenanceResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private serviceCategoryRepository: IServiceCategoryRepository, // ✅ NOVO
  ) {}

  async execute({
    id,
    data,
    serviceCategoryId,
  }: UpdateMaintenanceRequest): Promise<UpdateMaintenanceResponse> {
    const existingMaintenance = await this.maintenanceRepository.findById(id)

    if (!existingMaintenance) {
      throw new MaintenanceNotFoundError()
    }

    if (serviceCategoryId) {
      const serviceCategory =
        await this.serviceCategoryRepository.findById(serviceCategoryId)
      if (!serviceCategory) {
        throw new ServiceCategoryNotFoundError()
      }
    }

    const updateData: Prisma.MaintenanceUpdateInput = {
      ...data,
    }

    if (serviceCategoryId !== undefined) {
      if (serviceCategoryId === null) {
        // Remove a categoria
        updateData.serviceCategory = { disconnect: true }
      } else {
        // Conecta nova categoria
        updateData.serviceCategory = { connect: { id: serviceCategoryId } }
      }
    }

    // Normalizar actual_cost
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

    // Normalizar estimated_cost
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

    // Atualizar completed_date
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
