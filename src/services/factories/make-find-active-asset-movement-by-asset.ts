import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { FindActiveAssetMovementByAssetUseCase } from '../asset-moviment/find-active-asset-movement-by-asset-use-case'

export function makeFindActiveAssetMovementByAsset() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new FindActiveAssetMovementByAssetUseCase(
    assetMovementRepository,
  )

  return useCase
}
