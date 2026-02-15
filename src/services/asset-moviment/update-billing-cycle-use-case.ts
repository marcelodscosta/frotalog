import { AssetMovement, BillingCycle } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { AssetMovimentNotFoundError } from '../errors/asset-moviment-not-found-error'

interface UpdateBillingCycleUseCaseRequest {
  id: string
  billingCycle: BillingCycle
}

interface UpdateBillingCycleUseCaseResponse {
  assetMovement: AssetMovement
}

export class UpdateBillingCycleUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    id,
    billingCycle,
  }: UpdateBillingCycleUseCaseRequest): Promise<UpdateBillingCycleUseCaseResponse> {
    const checkAssetMovementExists = await this.assetMovementRepository.findById(id)

    if (!checkAssetMovementExists) {
      throw new AssetMovimentNotFoundError()
    }

    const assetMovement = await this.assetMovementRepository.updateBillingCycle(
      id,
      billingCycle,
    )

    return { assetMovement }
  }
}
