import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { FindAllAssetCategoryUseCase } from '../asset-category/find-all-asset-category-use-case'

export function makeFindAllAssetCategories() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const findAllAssetCategortUseCase = new FindAllAssetCategoryUseCase(
    assetCategoryRepository,
  )
  return findAllAssetCategortUseCase
}
