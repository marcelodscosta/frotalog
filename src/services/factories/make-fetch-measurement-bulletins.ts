import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { FetchMeasurementBulletinsUseCase } from '../measurement-bulletin/fetch-measurement-bulletins-use-case'

export function makeFetchMeasurementBulletins() {
  return new FetchMeasurementBulletinsUseCase(
    new PrismaMeasurementBulletinRepository(),
  )
}
