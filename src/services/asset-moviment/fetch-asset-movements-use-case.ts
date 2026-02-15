import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchAssetMovementsUseCaseRequest {
  page: number
}

interface FetchAssetMovementsUseCaseResponse {
  assetMovements: PaginatedResult<AssetMovement>
}

export class FetchAssetMovementsUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    page,
  }: FetchAssetMovementsUseCaseRequest): Promise<FetchAssetMovementsUseCaseResponse> {
    const assetMovements = await this.assetMovementRepository.findAll(page)

    return { assetMovements }
  }
}
