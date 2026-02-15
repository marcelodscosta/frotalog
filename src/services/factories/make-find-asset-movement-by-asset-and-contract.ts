import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { FindAssetMovementByAssetAndContractUseCase } from '../asset-moviment/find-asset-movement-by-asset-and-contract-use-case'

export function makeFindAssetMovementByAssetAndContract() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new FindAssetMovementByAssetAndContractUseCase(
    assetMovementRepository,
  )

  return useCase
}
