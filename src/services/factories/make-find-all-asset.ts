import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { FindAllAssetUseCase } from '../asset/find-all-asset-use-case'

export function makeFindAllAsset() {
  const assetRepository = new PrismaAssetRepository()
  const findAllAssetUseCase = new FindAllAssetUseCase(assetRepository)
  return findAllAssetUseCase
}
