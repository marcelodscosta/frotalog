import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetByBrandRequest {
  page: number
  brand: string
}

interface GetAssetByBrandResponse {
  assets: Asset[]
}

export class GetAssetByBrandUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    page,
    brand,
  }: GetAssetByBrandRequest): Promise<GetAssetByBrandResponse> {
    const assets = await this.assetRepository.findByBrand(brand, page)
    return { assets }
  }
}
