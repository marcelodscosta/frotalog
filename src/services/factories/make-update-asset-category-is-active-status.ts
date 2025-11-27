import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { UpdateAssetCategoryActiveStatusUseCase } from '../asset-category/update-asset-category-active-status.use-case'

export function makeUpdateAssetCategoryIsActiveStatus() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const updateAssetCategoryActiveStatusUseCase =
    new UpdateAssetCategoryActiveStatusUseCase(assetCategoryRepository)
  return updateAssetCategoryActiveStatusUseCase
}
