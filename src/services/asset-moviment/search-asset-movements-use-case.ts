import { AssetMovement, BillingCycle } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface SearchAssetMovementsUseCaseRequest {
  assetId?: string
  contractId?: string
  billingCycle?: BillingCycle
  isActive?: boolean
  type?: 'DEPLOYMENT' | 'RETURN' | 'MAINTENANCE' | 'TRANSFER'
  mobilizationDateFrom?: Date
  mobilizationDateTo?: Date
  page: number
}

interface SearchAssetMovementsUseCaseResponse {
  assetMovements: PaginatedResult<AssetMovement>
}

export class SearchAssetMovementsUseCase {
  constructor(private assetMovementRepository: IAssetMovementRepository) {}

  async execute(
    params: SearchAssetMovementsUseCaseRequest,
  ): Promise<SearchAssetMovementsUseCaseResponse> {
    const assetMovements = await this.assetMovementRepository.search(params)

    return { assetMovements }
  }
}
