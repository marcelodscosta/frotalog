import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { CreateAssetUseCase } from '../asset/create-asset-use-case'

export function makeCreateAsset() {
  const assetRepository = new PrismaAssetRepository()
  const assetCategoryRepository = new PrismaAssetCategoryRepository()
  const createAssetUseCase = new CreateAssetUseCase(
    assetRepository,
    assetCategoryRepository,
  )
  return createAssetUseCase
}
