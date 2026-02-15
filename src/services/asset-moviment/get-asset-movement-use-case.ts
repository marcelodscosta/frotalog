import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'

interface GetAssetMovementUseCaseRequest {
  id: string
}

interface GetAssetMovementUseCaseResponse {
  assetMovement: AssetMovement
}

export class GetAssetMovementUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    id,
  }: GetAssetMovementUseCaseRequest): Promise<GetAssetMovementUseCaseResponse> {
    const assetMovement = await this.assetMovementRepository.findById(id)

    if (!assetMovement) {
      throw new AssetMovimentNotFoundError()
    }

    return { assetMovement }
  }
}
