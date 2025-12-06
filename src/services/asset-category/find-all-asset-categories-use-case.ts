import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface FindAllAssetCategoriesResponse {
  assetCategories: AssetCategory[]
}

export class FindAllAssetCategoriesUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute(): Promise<FindAllAssetCategoriesResponse> {
    const assetCategories =
      await this.assetCategoryRepository.findAllAssetCategories()
    return {
      assetCategories,
    }
  }
}
