import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { FindAllAssetCategoriesUseCase } from '../asset-category/find-all-asset-categories-use-case'

export function makeFindAllAssetCategoriesAll() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const findAllAssetCategoriestUseCase = new FindAllAssetCategoriesUseCase(
    assetCategoryRepository,
  )
  return findAllAssetCategoriestUseCase
}
