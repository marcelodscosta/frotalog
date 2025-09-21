import { AssetCategory, Prisma } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'
import { AssetCategoryNotFoundError } from '../errors/asset-category-not-found-error'

interface UpdateAssetCategoryRequest {
  id: string
  data: Prisma.AssetCategoryUpdateInput
}

interface UpdateAssetCategoryResponse {
  assetCategory: AssetCategory
}

export class UpdateAssetCategoryUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    id,
    data,
  }: UpdateAssetCategoryRequest): Promise<UpdateAssetCategoryResponse> {
    const existingAssetCategory =
      await this.assetCategoryRepository.findById(id)
    if (!existingAssetCategory) {
      throw new AssetCategoryNotFoundError()
    }
    const assetCategory =
      await this.assetCategoryRepository.updateAssetCategory(id, data)
    return { assetCategory }
  }
}
