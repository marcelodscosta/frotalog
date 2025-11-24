import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface FindAssetsBySerialNumberRequest {
  serialNumber: string
  page: number
}

interface FindAssetsBySerialNumberResponse {
  assets: Asset[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindAssetsBySerialNumberUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({ serialNumber, page }: FindAssetsBySerialNumberRequest): Promise<FindAssetsBySerialNumberResponse> {
    // Buscar asset pelo número de série (único por constraint unique)
    const asset = await this.assetRepository.findBySerialNumber(serialNumber)
    
    if (!asset) {
      return {
        assets: [],
        currentPage: page,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
      }
    }

    // Retornar no formato paginado mesmo sendo único resultado
    return {
      assets: [asset],
      currentPage: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
    }
  }
}

