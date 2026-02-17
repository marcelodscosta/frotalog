import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { DeleteMeasurementBulletinUseCase } from '../measurement-bulletin/delete-measurement-bulletin-use-case'

export function makeDeleteMeasurementBulletin() {
  return new DeleteMeasurementBulletinUseCase(
    new PrismaMeasurementBulletinRepository(),
  )
}
