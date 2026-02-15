import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchAssetMovementsByAssetUseCaseRequest {
  assetId: string
  page: number
}

interface FetchAssetMovementsByAssetUseCaseResponse {
  assetMovements: PaginatedResult<AssetMovement>
}

export class FetchAssetMovementsByAssetUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    assetId,
    page,
  }: FetchAssetMovementsByAssetUseCaseRequest): Promise<FetchAssetMovementsByAssetUseCaseResponse> {
    const assetMovements = await this.assetMovementRepository.findByAssetId(
      assetId,
      page,
    )

    return { assetMovements }
  }
}
