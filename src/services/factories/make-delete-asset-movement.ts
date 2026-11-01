import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { DeleteAssetMovementUseCase } from '../asset-moviment/delete-asset-movement-use-case'

export function makeDeleteAssetMovement() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const contractRepository = new PrismaContractRepository()
  const useCase = new DeleteAssetMovementUseCase(
    assetMovementRepository,
    contractRepository,
  )

  return useCase
}
