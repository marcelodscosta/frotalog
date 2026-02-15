import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'

interface GetActiveMovementsByAssetUseCaseRequest {
  assetId: string
}

interface GetActiveMovementsByAssetUseCaseResponse {
  assetMovements: AssetMovement[]
}

export class GetActiveMovementsByAssetUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    assetId,
  }: GetActiveMovementsByAssetUseCaseRequest): Promise<GetActiveMovementsByAssetUseCaseResponse> {
    const assetMovements =
      await this.assetMovementRepository.getActiveMovementsByAsset(assetId)

    return { assetMovements }
  }
}
