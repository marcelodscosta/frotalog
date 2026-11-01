import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'
import { finishContractIfAllMovementsDemobilized } from './finish-contract-if-all-movements-demobilized'

interface DeleteAssetMovementUseCaseRequest {
  id: string
}

interface DeleteAssetMovementUseCaseResponse {
  assetMovement: AssetMovement
}

export class DeleteAssetMovementUseCase {
  constructor(
    private assetMovementRepository: IAssetMovementRepository,
    private contractRepository: IContractRepository,
  ) {}

  async execute({
    id,
  }: DeleteAssetMovementUseCaseRequest): Promise<DeleteAssetMovementUseCaseResponse> {
    const checkAssetMovementExists = await this.assetMovementRepository.findById(id)

    if (!checkAssetMovementExists) {
      throw new AssetMovimentNotFoundError()
    }

    const assetMovement = await this.assetMovementRepository.deleteAssetMovement(id)

    await finishContractIfAllMovementsDemobilized(
      assetMovement.contractId,
      this.assetMovementRepository,
      this.contractRepository,
    )

    return { assetMovement }
  }
}
