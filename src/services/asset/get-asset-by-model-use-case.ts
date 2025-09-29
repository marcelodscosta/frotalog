import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetByModelRequest {
  model: string
  page: number
}

interface GetAssetByModelResponse {
  assets: Asset[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class GetAssetByModelUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    model,
    page,
  }: GetAssetByModelRequest): Promise<GetAssetByModelResponse> {
    const result = await this.assetRepository.findByModel(model, page)
    return {
      assets: result.items,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }
}
