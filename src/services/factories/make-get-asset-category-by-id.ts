import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { GetAssetCategoryByIdUseCase } from '../asset-category/get-asset-category-by-id-use-case'

export function makeGetAssetCategoryById() {
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const getAssetCategoryByIdUseCase = new GetAssetCategoryByIdUseCase(
    assetCategoryRepository,
  )
  return getAssetCategoryByIdUseCase
}
