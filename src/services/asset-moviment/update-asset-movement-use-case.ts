import { AssetMovement, Prisma } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'

interface UpdateAssetMovementUseCaseRequest {
  id: string
  data: Prisma.AssetMovementUpdateInput
}

interface UpdateAssetMovementUseCaseResponse {
  assetMovement: AssetMovement
}

export class UpdateAssetMovementUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    id,
    data,
  }: UpdateAssetMovementUseCaseRequest): Promise<UpdateAssetMovementUseCaseResponse> {
    const assetMovementExists = await this.assetMovementRepository.findById(id)

    if (!assetMovementExists) {
      throw new AssetMovimentNotFoundError()
    }

    const assetMovement =
      await this.assetMovementRepository.updateAssetMovement(id, data)

    return { assetMovement }
  }
}
