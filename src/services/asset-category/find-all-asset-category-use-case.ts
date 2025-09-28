import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface FindAllAssetCategoryRequest {
  page: number
}

interface FindAllAssetCategoryResponse {
  assetCategories: AssetCategory[]
}

export class FindAllAssetCategortUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    page,
  }: FindAllAssetCategoryRequest): Promise<FindAllAssetCategoryResponse> {
    const assetCategories = await this.assetCategoryRepository.findAll(page)
    return { assetCategories }
  }
}
