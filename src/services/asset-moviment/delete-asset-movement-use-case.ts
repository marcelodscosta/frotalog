import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'

interface DeleteAssetMovementUseCaseRequest {
  id: string
}

interface DeleteAssetMovementUseCaseResponse {
  assetMovement: AssetMovement
}

export class DeleteAssetMovementUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    id,
  }: DeleteAssetMovementUseCaseRequest): Promise<DeleteAssetMovementUseCaseResponse> {
    const checkAssetMovementExists = await this.assetMovementRepository.findById(id)

    if (!checkAssetMovementExists) {
      throw new AssetMovimentNotFoundError()
    }

    const assetMovement = await this.assetMovementRepository.deleteAssetMovement(id)

    return { assetMovement }
  }
}
