import {
  MeasurementBulletin,
  MeasurementBulletinStatus,
} from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateMeasurementBulletinRequest {
  id: string
  status?: MeasurementBulletinStatus
  notes?: string | null
}

interface UpdateMeasurementBulletinResponse {
  measurementBulletin: MeasurementBulletin
}

export class UpdateMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute(
    data: UpdateMeasurementBulletinRequest,
  ): Promise<UpdateMeasurementBulletinResponse> {
    const existing = await this.measurementBulletinRepository.findById(data.id)
    if (!existing) throw new ResourceNotFoundError()

    const measurementBulletin =
      await this.measurementBulletinRepository.update(data.id, {
        status: data.status,
        notes: data.notes,
      })

    return { measurementBulletin }
  }
}
