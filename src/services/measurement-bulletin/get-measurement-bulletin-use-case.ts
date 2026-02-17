import { MeasurementBulletin } from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetMeasurementBulletinRequest {
  id: string
}

interface GetMeasurementBulletinResponse {
  measurementBulletin: MeasurementBulletin
}

export class GetMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute({
    id,
  }: GetMeasurementBulletinRequest): Promise<GetMeasurementBulletinResponse> {
    const measurementBulletin =
      await this.measurementBulletinRepository.findByIdWithDetails(id)

    if (!measurementBulletin) throw new ResourceNotFoundError()

    return { measurementBulletin }
  }
}
