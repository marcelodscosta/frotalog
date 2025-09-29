import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface FindAllAssetRequest {
  page: number
}

interface FindAllAssetResponse {
  assets: Asset[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindAllAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({ page }: FindAllAssetRequest): Promise<FindAllAssetResponse> {
    const result = await this.assetRepository.findAll(page)
    return {
      assets: result.items,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }
}
