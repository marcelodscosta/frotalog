import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'
import { ServiceCategoryNotFoundError } from '../errors/service-category-not-found-error'

interface UpdateMaintenanceRequest {
  id: string
  data: Prisma.MaintenanceUpdateInput
  serviceCategoryId?: string | null
}

interface UpdateMaintenanceResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private serviceCategoryRepository: IServiceCategoryRepository,
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
        updateData.serviceCategory = { disconnect: true }
      } else {
        updateData.serviceCategory = {
          connect: { id: serviceCategoryId },
        }
      }
    }

    if (data.completed_date !== undefined) {
      updateData.completed_date = data.completed_date
    }

    const maintenance = await this.maintenanceRepository.updateMaintenance(
      id,
      updateData,
    )

    return { maintenance }
  }
}
