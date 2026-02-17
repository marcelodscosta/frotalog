import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'
import { SupplierNotFoundError } from '../errors/supplier-not-found-error'
import { ServiceCategoryNotFoundError } from '../errors/service-category-not-found-error'

interface CreateMaintenanceRequest {
  assetId: string
  supplierId: string
  serviceCategoryId?: string
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY'
  description: string
  scheduled_date: Date
  estimated_cost?: number | null
  equipment_inactive?: boolean
  notes?: string | null
}

interface CreateMaintenanceResponse {
  maintenance: Maintenance
}

export class CreateMaintenanceUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
    private supplierRepository: ISupplierRepository,
    private serviceCategoryRepository: IServiceCategoryRepository,
  ) {}

  async execute(
    data: CreateMaintenanceRequest,
  ): Promise<CreateMaintenanceResponse> {
    const asset = await this.assetRepository.findById(data.assetId)
    if (!asset) {
      throw new AssetNotFoundError()
    }

    const supplier = await this.supplierRepository.findById(data.supplierId)
    if (!supplier) {
      throw new SupplierNotFoundError()
    }

    if (data.serviceCategoryId) {
      const serviceCategory = await this.serviceCategoryRepository.findById(
        data.serviceCategoryId,
      )

      if (!serviceCategory) {
        throw new ServiceCategoryNotFoundError()
      }
    }

    const maintenance = await this.maintenanceRepository.create({
      asset: { connect: { id: data.assetId } },
      supplier: { connect: { id: data.supplierId } },

      ...(data.serviceCategoryId && {
        serviceCategory: { connect: { id: data.serviceCategoryId } },
      }),

      type: data.type,
      description: data.description,
      scheduled_date: data.scheduled_date,
      estimated_cost: data.estimated_cost ?? null,
      equipment_inactive: data.equipment_inactive ?? false,
      notes: data.notes ?? null,
    })

    return { maintenance }
  }
}
