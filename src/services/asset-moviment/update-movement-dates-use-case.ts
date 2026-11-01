import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'
import { finishContractIfAllMovementsDemobilized } from './finish-contract-if-all-movements-demobilized'

interface UpdateMovementDatesUseCaseRequest {
  id: string
  integrationDate?: Date
  demobilizationDate?: Date
}

interface UpdateMovementDatesUseCaseResponse {
  assetMovement: AssetMovement
}

export class UpdateMovementDatesUseCase {
  constructor(
    private assetMovementRepository: IAssetMovementRepository,
    private contractRepository: IContractRepository,
  ) {}

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

    await finishContractIfAllMovementsDemobilized(
      assetMovement.contractId,
      this.assetMovementRepository,
      this.contractRepository,
    )

    return { assetMovement }
  }
}
