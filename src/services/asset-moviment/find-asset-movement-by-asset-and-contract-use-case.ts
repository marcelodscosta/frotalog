import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'

interface FindAssetMovementByAssetAndContractUseCaseRequest {
  assetId: string
  contractId: string
}

interface FindAssetMovementByAssetAndContractUseCaseResponse {
  assetMovement: AssetMovement | null
}

export class FindAssetMovementByAssetAndContractUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    assetId,
    contractId,
  }: FindAssetMovementByAssetAndContractUseCaseRequest): Promise<FindAssetMovementByAssetAndContractUseCaseResponse> {
    const assetMovement = await this.assetMovementRepository.findByAssetAndContract(
      assetId,
      contractId,
    )

    return { assetMovement }
  }
}
