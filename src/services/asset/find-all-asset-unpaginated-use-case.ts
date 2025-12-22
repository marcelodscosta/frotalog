import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface FindAllAssetUnpaginatedResponse {
  assets: Asset[]
}

export class FindAllAssetUnpaginatedUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(): Promise<FindAllAssetUnpaginatedResponse> {
    const assets = await this.assetRepository.findAllUnpaginated()
    return {
      assets,
    }
  }
}
