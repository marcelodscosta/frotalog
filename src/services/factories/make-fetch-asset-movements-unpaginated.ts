import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { FetchAssetMovementsUnpaginatedUseCase } from '../asset-moviment/fetch-asset-movements-unpaginated-use-case'

export function makeFetchAssetMovementsUnpaginated() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new FetchAssetMovementsUnpaginatedUseCase(
    assetMovementRepository,
  )

  return useCase
}
