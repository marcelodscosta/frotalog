import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'

interface UpdateMovementDatesUseCaseRequest {
  id: string
  integrationDate?: Date
  demobilizationDate?: Date
}

interface UpdateMovementDatesUseCaseResponse {
  assetMovement: AssetMovement
}

export class UpdateMovementDatesUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    id,
    integrationDate,
    demobilizationDate,
  }: UpdateMovementDatesUseCaseRequest): Promise<UpdateMovementDatesUseCaseResponse> {
    const checkAssetMovementExists = await this.assetMovementRepository.findById(id)

    if (!checkAssetMovementExists) {
      throw new AssetMovimentNotFoundError()
    }

    const assetMovement = await this.assetMovementRepository.updateMovementDates(
      id,
      integrationDate,
      demobilizationDate,
    )

    return { assetMovement }
  }
}
