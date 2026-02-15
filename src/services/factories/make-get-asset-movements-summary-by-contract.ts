import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { GetAssetMovementsSummaryByContractUseCase } from '../asset-moviment/get-asset-movements-summary-by-contract-use-case'

export function makeGetAssetMovementsSummaryByContract() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new GetAssetMovementsSummaryByContractUseCase(
    assetMovementRepository,
  )

  return useCase
}
