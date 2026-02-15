import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'

interface FetchAssetMovementsUnpaginatedUseCaseResponse {
  assetMovements: AssetMovement[]
}

export class FetchAssetMovementsUnpaginatedUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute(): Promise<FetchAssetMovementsUnpaginatedUseCaseResponse> {
    const assetMovements = await this.assetMovementRepository.findAllUnpaginated()

    return { assetMovements }
  }
}
