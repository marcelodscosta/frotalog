import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'

interface FindActiveAssetMovementByAssetUseCaseRequest {
  assetId: string
}

interface FindActiveAssetMovementByAssetUseCaseResponse {
  assetMovement: AssetMovement | null
}

export class FindActiveAssetMovementByAssetUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    assetId,
  }: FindActiveAssetMovementByAssetUseCaseRequest): Promise<FindActiveAssetMovementByAssetUseCaseResponse> {
    const assetMovement = await this.assetMovementRepository.findActiveByAssetId(
      assetId,
    )

    return { assetMovement }
  }
}
