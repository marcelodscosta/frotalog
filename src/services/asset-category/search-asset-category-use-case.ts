import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface SearchAssetCategoryRequest {
  query: string
  page: number
}

interface SearchAssetCategoryResponse {
  assetCategories: AssetCategory[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class SearchAssetCategoryUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    query,
    page,
  }: SearchAssetCategoryRequest): Promise<SearchAssetCategoryResponse> {
    const result = await this.assetCategoryRepository.searchAssetCategory(
      query,
      page,
    )
    console.log(result)
    return {
      assetCategories: result.items,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }
}
