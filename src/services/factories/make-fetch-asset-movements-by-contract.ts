import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { FetchAssetMovementsByContractUseCase } from '../asset-moviment/fetch-asset-movements-by-contract-use-case'

export function makeFetchAssetMovementsByContract() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new FetchAssetMovementsByContractUseCase(
    assetMovementRepository,
  )

  return useCase
}
