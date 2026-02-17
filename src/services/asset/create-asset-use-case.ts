import { Asset } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetCategoryNotFoundError } from '../errors/asset-category-not-found-error'

type AssetOwnership = 'OWN' | 'THIRD'

interface CreateAssetRequest {
  brand: string
  model: string
  year?: number
  plate?: string | null
  serial_number?: string | null
  assetCategoryId: string

  ownership?: AssetOwnership
  documentsUrl?: string | null
  notes?: string | null

  initial_horometer?: number | null
  current_horometer?: number | null
  initial_odometer?: number | null
  current_odometer?: number | null
  maintenance_frequency_hours?: number | null
  maintenance_frequency_km?: number | null
}

interface CreateAssetResponse {
  asset: Asset
}

export class CreateAssetUseCase {
  constructor(
    private assetRepository: IAssetRepository,
    private assetCategoryRepository: IAssetCategoryRepository,
  ) {}

  async execute(data: CreateAssetRequest): Promise<CreateAssetResponse> {
    const assetCategory = await this.assetCategoryRepository.findById(
      data.assetCategoryId,
    )

    if (!assetCategory) {
      throw new AssetCategoryNotFoundError()
    }

    const asset = await this.assetRepository.create(data)
    return { asset }
  }
}
