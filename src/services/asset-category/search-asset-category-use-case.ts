import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface SearchAssetCategoryRequest {
  query: string
  page: number
}

interface SearchAssetCategoryResponse {
  assetCategory: AssetCategory[]
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
    return {
      assetCategory: result.items,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }
}
