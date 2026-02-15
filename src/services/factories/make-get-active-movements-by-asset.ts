import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { GetActiveMovementsByAssetUseCase } from '../asset-moviment/get-active-movements-by-asset-use-case'

export function makeGetActiveMovementsByAsset() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new GetActiveMovementsByAssetUseCase(assetMovementRepository)

  return useCase
}
