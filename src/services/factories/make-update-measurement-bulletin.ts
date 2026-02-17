import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { UpdateMeasurementBulletinUseCase } from '../measurement-bulletin/update-measurement-bulletin-use-case'

export function makeUpdateMeasurementBulletin() {
  return new UpdateMeasurementBulletinUseCase(
    new PrismaMeasurementBulletinRepository(),
  )
}
