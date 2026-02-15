import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'

interface GetAssetMovementWithDetailsUseCaseRequest {
  id: string
}

interface GetAssetMovementWithDetailsUseCaseResponse {
  assetMovement: AssetMovement
}

export class GetAssetMovementWithDetailsUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    id,
  }: GetAssetMovementWithDetailsUseCaseRequest): Promise<GetAssetMovementWithDetailsUseCaseResponse> {
    const assetMovement = await this.assetMovementRepository.getAssetMovementWithDetails(
      id,
    )

    if (!assetMovement) {
      throw new AssetMovimentNotFoundError()
    }

    return { assetMovement }
  }
}
