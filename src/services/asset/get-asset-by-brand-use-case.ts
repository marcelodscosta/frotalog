import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetByBrandRequest {
  page: number
  brand: string
}

interface GetAssetByBrandResponse {
  assets: Asset[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class GetAssetByBrandUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    page,
    brand,
  }: GetAssetByBrandRequest): Promise<GetAssetByBrandResponse> {
    const result = await this.assetRepository.findByBrand(brand, page)
    return {
      assets: result.items,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }
}
