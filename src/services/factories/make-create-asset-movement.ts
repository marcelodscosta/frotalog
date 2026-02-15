import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { CreateAssetMovementUseCase } from '../asset-moviment/create-asset-moviment-use-case'

export function makeCreateAssetMovement() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const assetRepository = new PrismaAssetRepository()
  const contractRepository = new PrismaContractRepository()

  return new CreateAssetMovementUseCase(
    assetMovementRepository,
    assetRepository,
    contractRepository,
  )
}
