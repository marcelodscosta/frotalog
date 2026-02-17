import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { GetMeasurementBulletinUseCase } from '../measurement-bulletin/get-measurement-bulletin-use-case'

export function makeGetMeasurementBulletin() {
  return new GetMeasurementBulletinUseCase(
    new PrismaMeasurementBulletinRepository(),
  )
}
