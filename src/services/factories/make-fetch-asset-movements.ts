import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { FetchAssetMovementsUseCase } from '../asset-moviment/fetch-asset-movements-use-case'

export function makeFetchAssetMovements() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new FetchAssetMovementsUseCase(assetMovementRepository)

  return useCase
}
