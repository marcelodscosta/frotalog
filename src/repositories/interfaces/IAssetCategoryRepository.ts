import { AssetCategory, Prisma } from '../../generated/prisma'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export interface IAssetCategoryRepository {
  create(data: Prisma.AssetCategoryCreateInput): Promise<AssetCategory>
  findById(id: string): Promise<AssetCategory | null>
  searchAssetCategory(
    query: string,
    page: number,
  ): Promise<PaginatedResult<AssetCategory>>
  updateAssetCategory(
    id: string,
    data: Prisma.AssetCategoryUpdateInput,
  ): Promise<AssetCategory>

  findAll(page: number): Promise<PaginatedResult<AssetCategory>>
}
