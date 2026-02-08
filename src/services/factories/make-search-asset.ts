import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { SearchAssetUseCase } from '../asset/search-asset-use-case'

export function makeSearchAsset() {
  const assetRepository = new PrismaAssetRepository()
  const useCase = new SearchAssetUseCase(assetRepository)

  return useCase
}
