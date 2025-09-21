import { Prisma, Asset } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IAssetRepository } from '../interfaces/IAssetRepository'

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

  async findAll(page: number): Promise<Asset[]> {
    const PAGE_SIZE = 20
    const assets = await prisma.asset.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return assets
  }

  async findByBrand(brand: string, page: number): Promise<Asset[]> {
    const PAGE_SIZE = 20

    const assets = await prisma.asset.findMany({
      where: { brand },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return assets
  }

  async findByModel(model: string, page: number): Promise<Asset[]> {
    const PAGE_SIZE = 20
    const assets = await prisma.asset.findMany({
      where: { model },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return assets
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
