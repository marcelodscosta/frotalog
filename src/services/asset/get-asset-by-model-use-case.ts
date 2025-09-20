import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetByModelRequest {
  model: string
  page: number
}

interface GetAssetByModelResponse {
  assets: Asset[]
}

export class GetAssetByModelUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    model,
    page,
  }: GetAssetByModelRequest): Promise<GetAssetByModelResponse> {
    const assets = await this.assetRepository.findByModel(model, page)
    return { assets }
  }
}
