import { Asset, Prisma } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'

interface UpdateAssetRequest {
  id: string
  data: Prisma.AssetUpdateInput
}

interface UpdateAssetResponse {
  asset: Asset
}

export class UpdateAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    id,
    data,
  }: UpdateAssetRequest): Promise<UpdateAssetResponse> {
    const existingAsset = await this.assetRepository.findById(id)
    if (!existingAsset) {
      throw new AssetNotFoundError()
    }
    const asset = await this.assetRepository.updateAsset(id, data)

    return { asset }
  }
}
