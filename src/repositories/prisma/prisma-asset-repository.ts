import { Prisma, Asset } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IAssetRepository } from '../interfaces/IAssetRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaAssetRepository implements IAssetRepository {
  async create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset> {
    const asset = await prisma.asset.create({ data })
    return asset
  }

  async updateAsset(id: string, data: Prisma.AssetUpdateInput): Promise<Asset> {
    const updateAsset = await prisma.asset.update({
      where: {
        id,
      },
      data,
    })
    return updateAsset
  }

  async findAll(page: number): Promise<PaginatedResult<Asset>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [assets, totalCount] = await prisma.$transaction([
      prisma.asset.findMany({
        where: { is_Active: true },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.asset.count({
        where: { is_Active: true },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: assets,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByBrand(
    brand: string,
    page: number,
  ): Promise<PaginatedResult<Asset>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [assets, totalCount] = await prisma.$transaction([
      prisma.asset.findMany({
        where: {
          is_Active: true,
          brand: { equals: brand, mode: 'insensitive' },
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.asset.count({
        where: {
          is_Active: true,
          brand: { equals: brand, mode: 'insensitive' },
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: assets,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByModel(
    model: string,
    page: number,
  ): Promise<PaginatedResult<Asset>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [assets, totalCount] = await prisma.$transaction([
      prisma.asset.findMany({
        where: {
          is_Active: true,
          model,
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.asset.count({
        where: {
          is_Active: true,
          model,
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: assets,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findById(id: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { id },
    })

    return asset
  }

  async findByPlate(plate: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { plate },
    })
    return asset
  }

  async findBySerialNumber(serialNumber: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { serial_number: serialNumber },
    })
    return asset
  }
}
