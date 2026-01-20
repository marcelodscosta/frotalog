import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository' // ✅ NOVO
import { AssetNotFoundError } from '../errors/asset-not-found-error'
import { SupplierNotFoundError } from '../errors/supplier-not-found-error'
import { ServiceCategoryNotFoundError } from '../errors/service-category-not-found-error'

interface CreateMaintenanceRequest {
  assetId: string
  supplierId: string
  serviceCategoryId?: string // ✅ NOVO - opcional
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY'
  description: string
  scheduled_date: Date
  estimated_cost?: number
  notes?: string
}

interface CreateMaintenanceResponse {
  maintenance: Maintenance
}

export class CreateMaintenanceUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
    private supplierRepository: ISupplierRepository,
    private serviceCategoryRepository: IServiceCategoryRepository, // ✅ NOVO
  ) {}

  async execute(
    data: CreateMaintenanceRequest,
  ): Promise<CreateMaintenanceResponse> {
    // Verificar se o asset existe
    const asset = await this.assetRepository.findById(data.assetId)
    if (!asset) {
      throw new AssetNotFoundError()
    }

    // Verificar se o supplier existe
    const supplier = await this.supplierRepository.findById(data.supplierId)
    if (!supplier) {
      throw new SupplierNotFoundError()
    }

    // ✅ NOVO - Verificar se a categoria de serviço existe (se fornecida)
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
      // ✅ NOVO - Conectar categoria se fornecida
      ...(data.serviceCategoryId && {
        serviceCategory: { connect: { id: data.serviceCategoryId } },
      }),
      type: data.type,
      description: data.description,
      scheduled_date: data.scheduled_date,
      estimated_cost: data.estimated_cost,
      notes: data.notes,
    })

    return { maintenance }
  }
}
