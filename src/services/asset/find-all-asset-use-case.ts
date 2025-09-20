import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface FindAllAssetRequest {
  page: number
}

interface FindAllAssetResponse {
  assets: Asset[]
}

export class FindAllAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({ page }: FindAllAssetRequest): Promise<FindAllAssetResponse> {
    const assets = await this.assetRepository.findAll(page)
    return { assets }
  }
}
