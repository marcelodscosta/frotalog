import { AssetCategory, Prisma } from '../../generated/prisma'

export interface IAssetCategoryRepository {
  create(data: Prisma.AssetCategoryCreateInput): Promise<AssetCategory>
  findById(id: string): Promise<AssetCategory | null>
  searchAssetCategory(query: string, page: number): Promise<AssetCategory[]>
}
