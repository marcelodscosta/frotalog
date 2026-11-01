import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { UpdateMovementDatesUseCase } from '../asset-moviment/update-movement-dates-use-case'

export function makeUpdateMovementDates() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const contractRepository = new PrismaContractRepository()
  const useCase = new UpdateMovementDatesUseCase(
    assetMovementRepository,
    contractRepository,
  )

  return useCase
}
