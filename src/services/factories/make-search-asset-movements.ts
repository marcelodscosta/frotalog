import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { SearchAssetMovementsUseCase } from '../asset-moviment/search-asset-movements-use-case'

export function makeSearchAssetMovements() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new SearchAssetMovementsUseCase(assetMovementRepository)

  return useCase
}
