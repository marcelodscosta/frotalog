import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'

interface GetActiveContractByAssetRequest {
  assetId: string
}

interface GetActiveContractByAssetResponse {
  contract: Contract | null
}

export class GetActiveContractByAssetUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    assetId,
  }: GetActiveContractByAssetRequest): Promise<GetActiveContractByAssetResponse> {
    const contract = await this.contractRepository.findActiveByAssetId(assetId)

    return {
      contract,
    }
  }
}
