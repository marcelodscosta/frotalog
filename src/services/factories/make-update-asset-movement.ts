import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { UpdateAssetMovementUseCase } from '../asset-moviment/update-asset-movement-use-case'

export function makeUpdateAssetMovement() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new UpdateAssetMovementUseCase(assetMovementRepository)

  return useCase
}
