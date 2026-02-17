import { MeasurementBulletin, MeasurementBulletinStatus } from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchMeasurementBulletinsRequest {
  contractId?: string
  assetId?: string
  status?: MeasurementBulletinStatus
  page: number
}

interface FetchMeasurementBulletinsResponse {
  bulletins: PaginatedResult<MeasurementBulletin>
}

export class FetchMeasurementBulletinsUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute({
    contractId,
    assetId,
    status,
    page,
  }: FetchMeasurementBulletinsRequest): Promise<FetchMeasurementBulletinsResponse> {
    const bulletins = await this.measurementBulletinRepository.findMany({
      page,
      contractId,
      assetId,
      status,
    })

    return { bulletins }
  }
}
