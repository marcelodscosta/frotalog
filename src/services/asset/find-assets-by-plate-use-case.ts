import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface FindAssetsByPlateRequest {
  plate: string
  page: number
}

interface FindAssetsByPlateResponse {
  assets: Asset[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindAssetsByPlateUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({ plate, page }: FindAssetsByPlateRequest): Promise<FindAssetsByPlateResponse> {
    // Buscar asset pela placa (único por constraint unique)
    const asset = await this.assetRepository.findByPlate(plate)
    
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

