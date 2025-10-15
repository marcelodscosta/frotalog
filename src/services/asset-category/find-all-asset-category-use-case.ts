import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface FindAllAssetCategoryRequest {
  page: number
}

interface FindAllAssetCategoryResponse {
  assetCategories: AssetCategory[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindAllAssetCategoryUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    page,
  }: FindAllAssetCategoryRequest): Promise<FindAllAssetCategoryResponse> {
    const { currentPage, items, pageSize, totalItems, totalPages } =
      await this.assetCategoryRepository.findAll(page)
    return {
      assetCategories: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
