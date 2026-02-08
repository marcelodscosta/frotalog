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
        skip,
        take: PAGE_SIZE,
        include: {
          assetCategory: true,
        },
      }),
      prisma.asset.count(),
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
        include: {
          assetCategory: true,
        },
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
        include: {
          assetCategory: true,
        },
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
      include: {
        assetCategory: true,
      },
    })

    return asset
  }

  async findByPlate(plate: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { plate },
      include: {
        assetCategory: true,
      },
    })
    return asset
  }

  async findBySerialNumber(serialNumber: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { serial_number: serialNumber },
      include: {
        assetCategory: true,
      },
    })
    return asset
  }

  async updateAssetIsActive(id: string, is_Active: boolean): Promise<Asset> {
    const asset = await prisma.asset.update({
      where: { id },
      data: { is_Active },
    })
    return asset
  }

  async findAllUnpaginated(): Promise<Asset[]> {
    return await prisma.asset.findMany({
      orderBy: { brand: 'asc' },
    })
  }

  async search({
    brand,
    model,
    plate,
    serial_number,
    ownership,
    assetCategoryId,
    page,
  }: {
    brand?: string
    model?: string
    plate?: string
    serial_number?: string
    ownership?: 'OWN' | 'THIRD'
    assetCategoryId?: string
    page: number
  }): Promise<PaginatedResult<Asset>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const where: Prisma.AssetWhereInput = {
      is_Active: true,
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' }
    }

    if (model) {
      where.model = { contains: model, mode: 'insensitive' }
    }

    if (plate) {
      where.plate = { contains: plate, mode: 'insensitive' }
    }

    if (serial_number) {
      where.serial_number = { contains: serial_number, mode: 'insensitive' }
    }

    if (ownership) {
      where.ownership = ownership
    }

    if (assetCategoryId) {
      where.assetCategoryId = assetCategoryId
    }

    const [assets, totalCount] = await prisma.$transaction([
      prisma.asset.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        include: {
          assetCategory: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.asset.count({ where }),
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
}
