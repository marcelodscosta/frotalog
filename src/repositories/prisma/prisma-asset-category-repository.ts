import { Prisma, AssetCategory } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IAssetCategoryRepository } from '../interfaces/IAssetCategoryRepository'

export class PrismaAssetCategoryRepository implements IAssetCategoryRepository {
  async create(data: Prisma.AssetCategoryCreateInput): Promise<AssetCategory> {
    const assetCategory = await prisma.assetCategory.create({
      data,
    })
    return assetCategory
  }

  async findById(id: string): Promise<AssetCategory | null> {
    const assetCategory = await prisma.assetCategory.findUnique({
      where: { id },
    })
    return assetCategory
  }

  async searchAssetCategory(
    query: string,
    page: number,
  ): Promise<AssetCategory[]> {
    const PAGE_SIZE = 20
    const assetCategories = await prisma.assetCategory.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    })
    return assetCategories
  }

  async updateAssetCategory(
    id: string,
    data: Prisma.AssetCategoryUpdateInput,
  ): Promise<AssetCategory> {
    // TODO: Exception AssetCategoryNotFoundError
    const updatedAssetCategory = await prisma.assetCategory.update({
      where: { id },
      data,
    })
    return updatedAssetCategory
  }
}
