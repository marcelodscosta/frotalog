import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { UpdateBillingCycleUseCase } from '../asset-moviment/update-billing-cycle-use-case'

export function makeUpdateBillingCycle() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new UpdateBillingCycleUseCase(assetMovementRepository)

  return useCase
}
