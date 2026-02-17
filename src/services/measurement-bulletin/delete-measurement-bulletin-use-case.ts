import { MeasurementBulletin } from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class DeleteMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute(id: string): Promise<MeasurementBulletin> {
    const existing = await this.measurementBulletinRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    return this.measurementBulletinRepository.delete(id)
  }
}
