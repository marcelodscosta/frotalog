import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { SearchAssetCategoryUseCase } from '../asset-category/search-asset-category-use-case'

export function makeSearchAssetCategory() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const searchAssetCategoryUseCase = new SearchAssetCategoryUseCase(
    assetCategoryRepository,
  )
  return searchAssetCategoryUseCase
}
