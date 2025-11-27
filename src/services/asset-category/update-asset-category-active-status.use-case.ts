import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'
import { AssetCategoryNotFoundError } from '../errors/asset-category-not-found-error'

interface UpdateAssetCategoryActiveStatusRequest {
  id: string
  data: boolean
}

interface UpdateAssetCategoryActiveStatusResponse {
  assetCategory: AssetCategory
}

export class UpdateAssetCategoryActiveStatusUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    id,
    data,
  }: UpdateAssetCategoryActiveStatusRequest): Promise<UpdateAssetCategoryActiveStatusResponse> {
    const existingAssetCategory =
      await this.assetCategoryRepository.findById(id)
    if (!existingAssetCategory) {
      throw new AssetCategoryNotFoundError()
    }
    const assetCategory =
      await this.assetCategoryRepository.updateAssetCategoryIsActive(id, data)
    return { assetCategory }
  }
}
