import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'

interface GetAssetMovementsSummaryByContractUseCaseRequest {
  contractId: string
}

interface GetAssetMovementsSummaryByContractUseCaseResponse {
  assetMovements: AssetMovement[]
}

export class GetAssetMovementsSummaryByContractUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    contractId,
  }: GetAssetMovementsSummaryByContractUseCaseRequest): Promise<GetAssetMovementsSummaryByContractUseCaseResponse> {
    const assetMovements =
      await this.assetMovementRepository.getAssetMovementsSummaryByContract(
        contractId,
      )

    return { assetMovements }
  }
}
