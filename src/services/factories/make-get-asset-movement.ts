import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { GetAssetMovementUseCase } from '../asset-moviment/get-asset-movement-use-case'

export function makeGetAssetMovement() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new GetAssetMovementUseCase(assetMovementRepository)

  return useCase
}
