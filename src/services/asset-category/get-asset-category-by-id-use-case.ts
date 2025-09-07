import { AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface getAssetCategoryRequest {
  id: string
}

interface getAssetCategoryResponse {
  assetCategory: AssetCategory | null
}

export class GetAssetCategoryByIdUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    id,
  }: getAssetCategoryRequest): Promise<getAssetCategoryResponse> {
    const assetCategory = await this.assetCategoryRepository.findById(id)
    return { assetCategory }
  }
}
