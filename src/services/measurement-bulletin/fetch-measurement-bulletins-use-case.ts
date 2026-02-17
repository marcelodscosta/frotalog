import { MeasurementBulletin } from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchMeasurementBulletinsRequest {
  contractId?: string
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
    page,
  }: FetchMeasurementBulletinsRequest): Promise<FetchMeasurementBulletinsResponse> {
    const bulletins = contractId
      ? await this.measurementBulletinRepository.findByContractId(
          contractId,
          page,
        )
      : await this.measurementBulletinRepository.findAll(page)

    return { bulletins }
  }
}
