import { AssetCategory, Prisma } from '../../generated/prisma'

export interface IAssetCategoryRepository {
  create(data: Prisma.AssetCategoryCreateInput): Promise<AssetCategory>
  findById(id: string): Promise<AssetCategory | null>
  searchAssetCategory(query: string, page: number): Promise<AssetCategory[]>
  updateAssetCategory(
    id: string,
    data: Prisma.AssetCategoryUpdateInput,
  ): Promise<AssetCategory>

  findAll(page: number): Promise<AssetCategory[]>
}
