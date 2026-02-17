
import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'

interface CreateQuickMaintenanceRequest {
  assetId: string
  description: string
  date: Date
  horometer?: number
  odometer?: number
}

interface CreateQuickMaintenanceResponse {
  maintenance: Maintenance
}

export class CreateQuickMaintenanceUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
  ) {}

  async execute({
    assetId,
    description,
    date,
    horometer,
    odometer,
  }: CreateQuickMaintenanceRequest): Promise<CreateQuickMaintenanceResponse> {
    const asset = await this.assetRepository.findById(assetId)
    if (!asset) {
      throw new AssetNotFoundError()
    }

    // 1. Create Maintenance
    const maintenance = await this.maintenanceRepository.create({
      asset: { connect: { id: assetId } },
      type: 'PREVENTIVE', // Default to PREVENTIVE
      description,
      scheduled_date: date,
      completed_date: date, // Immediately completed
      status: 'COMPLETED',
      horometer: horometer ?? null,
      odometer: odometer ?? null,
      
      // Optional fields
      notes: 'Registro Rápido',
      equipment_inactive: false,
    })

    // 2. Update Asset Counters logic (similar to UpdateMaintenanceStatusUseCase)
    const assetUpdateData: any = {
        last_maintenance_date: date,
    }

    let shouldUpdateAsset = false

    if (horometer !== undefined) {
        shouldUpdateAsset = true
        assetUpdateData.last_maintenance_horometer = horometer
        if ((asset.current_horometer || 0) < horometer) {
            assetUpdateData.current_horometer = horometer
        }
    }

    if (odometer !== undefined) {
        shouldUpdateAsset = true
        assetUpdateData.last_maintenance_odometer = odometer
        if ((asset.current_odometer || 0) < odometer) {
            assetUpdateData.current_odometer = odometer
        }
    }

    if (shouldUpdateAsset) {
        await this.assetRepository.updateAsset(asset.id, assetUpdateData)
    }

    return { maintenance }
  }
}
