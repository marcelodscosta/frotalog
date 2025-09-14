import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface SearchAssetCategoryRequest {
  query: string
  page: number
}

interface SearchAssetCategoryResponse {
  assetCategory: AssetCategory[]
}

export class SearchAssetCategoryUseCase {
  constructor(private assetCategory: IAssetCategoryRepository) {}

  async execute({
    query,
    page,
  }: SearchAssetCategoryRequest): Promise<SearchAssetCategoryResponse> {
    const assetCategory = await this.assetCategory.searchAssetCategory(
      query,
      page,
    )
    return { assetCategory }
  }
}
