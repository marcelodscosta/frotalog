import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface SearchAssetRequest {
  brand?: string
  model?: string
  plate?: string
  serial_number?: string
  ownership?: 'OWN' | 'THIRD'
  assetCategoryId?: string
  page: number
}

interface SearchAssetResponse {
  assets: Asset[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class SearchAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    brand,
    model,
    plate,
    serial_number,
    ownership,
    assetCategoryId,
    page,
  }: SearchAssetRequest): Promise<SearchAssetResponse> {
    const result = await this.assetRepository.search({
      brand,
      model,
      plate,
      serial_number,
      ownership,
      assetCategoryId,
      page,
    })

    return {
      assets: result.items,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    }
  }
}
