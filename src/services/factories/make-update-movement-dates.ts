import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { UpdateMovementDatesUseCase } from '../asset-moviment/update-movement-dates-use-case'

export function makeUpdateMovementDates() {
  const assetMovementRepository = new PrismaAssetMovementRepository()
  const useCase = new UpdateMovementDatesUseCase(assetMovementRepository)

  return useCase
}
