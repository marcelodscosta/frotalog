import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { PrismaAssetMovementRepository } from '../../repositories/prisma/prisma-asset-moviment-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { CreateMeasurementBulletinUseCase } from '../measurement-bulletin/create-measurement-bulletin-use-case'

export function makeCreateMeasurementBulletin() {
  return new CreateMeasurementBulletinUseCase(
    new PrismaMeasurementBulletinRepository(),
    new PrismaAssetMovementRepository(),
    new PrismaContractRepository(),
  )
}
