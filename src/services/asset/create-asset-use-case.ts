import { Asset } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetCategoryNotFoundError } from '../errors/asset-category-not-found-error'

interface CreateAssetRequest {
  brand: string
  model: string
  year?: number
  plate?: string
  serial_number?: string
  assetCategoryId: string
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
