import { AssetMovement } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchAssetMovementsByContractUseCaseRequest {
  contractId: string
  page: number
}

interface FetchAssetMovementsByContractUseCaseResponse {
  assetMovements: PaginatedResult<AssetMovement>
}

export class FetchAssetMovementsByContractUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute({
    contractId,
    page,
  }: FetchAssetMovementsByContractUseCaseRequest): Promise<FetchAssetMovementsByContractUseCaseResponse> {
    const assetMovements = await this.assetMovementRepository.findByContractId(
      contractId,
      page,
    )

    return { assetMovements }
  }
}
