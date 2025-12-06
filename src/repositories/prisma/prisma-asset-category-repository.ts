import { Prisma, AssetCategory } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IAssetCategoryRepository } from '../interfaces/IAssetCategoryRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

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
  ): Promise<PaginatedResult<AssetCategory>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.assetCategory.findMany({
        where: {
          is_Active: true,
          name: { contains: query, mode: 'insensitive' },
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.assetCategory.count({
        where: {
          is_Active: true,
          name: { contains: query, mode: 'insensitive' },
        },
      }),
    ])

    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async updateAssetCategory(
    id: string,
    data: Prisma.AssetCategoryUpdateInput,
  ): Promise<AssetCategory> {
    const updatedAssetCategory = await prisma.assetCategory.update({
      where: { id },
      data,
    })
    return updatedAssetCategory
  }

  async findAll(page: number): Promise<PaginatedResult<AssetCategory>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.assetCategory.findMany({
        skip,
        take: PAGE_SIZE,
      }),
      prisma.assetCategory.count(),
    ])

    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async updateAssetCategoryIsActive(
    id: string,
    is_Active: boolean,
  ): Promise<AssetCategory> {
    const assetCategory = await prisma.assetCategory.update({
      where: { id },
      data: { is_Active },
    })
    return assetCategory
  }

  async findAllAssetCategories(): Promise<AssetCategory[]> {
    const assetCategories = await prisma.assetCategory.findMany()
    return assetCategories
  }
}
