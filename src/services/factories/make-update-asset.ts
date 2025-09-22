import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { UpdateAssetUseCase } from '../asset/update-asset-use-case'

export function makeUpdateAsset() {
  const assetRepository = new PrismaAssetRepository()
  const updateAssetUseCase = new UpdateAssetUseCase(assetRepository)
  return updateAssetUseCase
}
