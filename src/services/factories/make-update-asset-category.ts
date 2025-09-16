import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { UpdateAssetCategoryUseCase } from '../asset-category/update-asset-category-use-case'

export function makeUpdateAssetCategory() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const updateAssetCategory = new UpdateAssetCategoryUseCase(
    assetCategoryRepository,
  )
  return updateAssetCategory
}
