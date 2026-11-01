import { AssetMovement, Prisma } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'
import { finishContractIfAllMovementsDemobilized } from './finish-contract-if-all-movements-demobilized'

interface UpdateAssetMovementUseCaseRequest {
  id: string
  data: Prisma.AssetMovementUpdateInput
}

interface UpdateAssetMovementUseCaseResponse {
  assetMovement: AssetMovement
}

export class UpdateAssetMovementUseCase {
  constructor(
    private assetMovementRepository: IAssetMovementRepository,
    private contractRepository: IContractRepository,
  ) {}

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

    await finishContractIfAllMovementsDemobilized(
      assetMovement.contractId,
      this.assetMovementRepository,
      this.contractRepository,
    )

    return { assetMovement }
  }
}
