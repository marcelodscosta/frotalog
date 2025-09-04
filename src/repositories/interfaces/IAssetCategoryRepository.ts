import { AssetCategory, Prisma } from '../../generated/prisma'

export interface IAssetCategoryRepository {
  create(data: Prisma.AssetCategoryCreateInput): Promise<AssetCategory>
}
