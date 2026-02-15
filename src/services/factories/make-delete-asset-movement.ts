import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { DeleteAssetMovementUseCase } from '../asset-moviment/delete-asset-movement-use-case'

export function makeDeleteAssetMovement() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new DeleteAssetMovementUseCase(assetMovementRepository)

  return useCase
}
