import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'

interface UpdateAssetActiveStatusRequest {
  id: string
  data: boolean
}

interface UpdateAssetActiveStatusResponse {
  asset: Asset
}

export class UpdateAssetActiveStatusUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    id,
    data,
  }: UpdateAssetActiveStatusRequest): Promise<UpdateAssetActiveStatusResponse> {
    const existingAsset = await this.assetRepository.findById(id)
    if (!existingAsset) {
      throw new AssetNotFoundError()
    }
    const asset = await this.assetRepository.updateAssetIsActive(id, data)
    return { asset }
  }
}
