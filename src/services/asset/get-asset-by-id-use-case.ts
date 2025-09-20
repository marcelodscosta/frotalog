import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetRequest {
  id: string
}

interface GetAssetResponse {
  asset: Asset | null
}

export class GetAssetByIdUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({ id }: GetAssetRequest): Promise<GetAssetResponse> {
    const asset = await this.assetRepository.findById(id)
    return { asset }
  }
}
