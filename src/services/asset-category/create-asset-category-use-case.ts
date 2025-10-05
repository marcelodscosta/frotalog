import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface CreateAssetCategoryRequest {
  name: string
  description: string
  type: 'VEHICLE' | 'EQUIPMENT'
}

interface CreateAssetCategoryResponse {
  assetCategory: AssetCategory
}

export class CreateAssetsCategoryUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute(
    data: CreateAssetCategoryRequest,
  ): Promise<CreateAssetCategoryResponse> {
    const assetCategory = await this.assetCategoryRepository.create(data)
    return { assetCategory }
  }
}
