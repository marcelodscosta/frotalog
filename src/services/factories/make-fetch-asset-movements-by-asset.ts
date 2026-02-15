import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { FetchAssetMovementsByAssetUseCase } from '../asset-moviment/fetch-asset-movements-by-asset-use-case'

export function makeFetchAssetMovementsByAsset() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new FetchAssetMovementsByAssetUseCase(assetMovementRepository)

  return useCase
}
