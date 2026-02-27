import { Maintenance } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'
import { ServiceCategoryNotFoundError } from '../errors/service-category-not-found-error'
import { SupplierNotFoundError } from '../errors/supplier-not-found-error'

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
  assignedToId?: string | null
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
    private assetMovementRepository: IAssetMovementRepository,
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

    const activeMovement = await this.assetMovementRepository.findActiveNotDemobilizedByAssetId(data.assetId)

    const maintenance = await this.maintenanceRepository.create({
      asset: { connect: { id: data.assetId } },
      supplier: { connect: { id: data.supplierId } },

      ...(data.serviceCategoryId && {
        serviceCategory: { connect: { id: data.serviceCategoryId } },
      }),

      ...(data.assignedToId && {
        assigned_to: { connect: { id: data.assignedToId } },
      }),

      ...(activeMovement && {
        contract: { connect: { id: activeMovement.contractId } },
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
