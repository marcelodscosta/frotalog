import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { CreateAssetsCategoryUseCase } from '../asset-category/create-asset-category-use-case'

export function makeCreateAssetCategory() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const createAssetCategoryUseCase = new CreateAssetsCategoryUseCase(
    assetCategoryRepository,
  )
  return createAssetCategoryUseCase
}
