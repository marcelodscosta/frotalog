import { AssetCategory, Prisma } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../../repositories/interfaces/IAssetCategoryRepository'

interface UpdateAssetCategoryRequest {
  id: string
  data: Prisma.AssetCategoryUpdateInput
}

interface UpdateAssetCategoryResponse {
  assetCategory: AssetCategory
}

export class UpdateAssetCategoryUseCase {
  constructor(private assetCategoryRepository: IAssetCategoryRepository) {}

  async execute({
    id,
    data,
  }: UpdateAssetCategoryRequest): Promise<UpdateAssetCategoryResponse> {
    const assetCategory =
      await this.assetCategoryRepository.updateAssetCategory(id, data)
    if (!assetCategory) {
      throw new Error('AssetCategory not found')
    }
    return { assetCategory }
  }
}
