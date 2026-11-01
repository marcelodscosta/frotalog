import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { UpdateAssetMovementUseCase } from '../asset-moviment/update-asset-movement-use-case'

export function makeUpdateAssetMovement() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const contractRepository = new PrismaContractRepository()
  const useCase = new UpdateAssetMovementUseCase(
    assetMovementRepository,
    contractRepository,
  )

  return useCase
}
