import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { GetAssetMovementWithDetailsUseCase } from '../asset-moviment/get-asset-movement-with-details-use-case'

export function makeGetAssetMovementWithDetails() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new GetAssetMovementWithDetailsUseCase(assetMovementRepository)

  return useCase
}
