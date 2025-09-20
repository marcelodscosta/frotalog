import { Prisma, Asset } from '../../generated/prisma'
import { AssetNotFoundError } from '../../services/errors/asset-not-found-error'
import { IAssetRepository } from '../interfaces/IAssetRepository'
import { randomUUID } from 'crypto'

export class InMemoryAssetRepository implements IAssetRepository {
  public items: Asset[] = []

  async create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset> {
    const asset = {
      id: data.id ?? randomUUID(),
      brand: data.brand,
      model: data.model,
      year: data.year ?? null,

      plate: data.plate ?? null,
      serial_number: data.serial_number ?? null,

      created_at: new Date(),
      updated_at: new Date(),
      is_Active: data.is_Active ?? true,

      assetCategoryId: data.assetCategoryId,
    }
    this.items.push(asset)
    return asset
  }

  async findById(id: string): Promise<Asset | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async updateAsset(id: string, data: Prisma.AssetUpdateInput): Promise<Asset> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new AssetNotFoundError()
    }
    const existing = this.items[index]
    const updated = {
      ...existing,
      ...data,
      updated_at: new Date(),
    }
    this.items[index] = updated as Asset
    return this.items[index]
  }

  async findByPlate(plate: string): Promise<Asset | null> {
    return (
      this.items.find(
        (item) => item.plate?.toLowerCase() === plate.toLowerCase(),
      ) ?? null
    )
  }

  async findBySerialNumber(serialNumber: string): Promise<Asset | null> {
    return (
      this.items.find(
        (item) =>
          item.serial_number?.toLowerCase() === serialNumber.toLowerCase(),
      ) ?? null
    )
  }

  async findAll(page: number): Promise<Asset[]> {
    return this.items.map((item) => item).slice((page - 1) * 20, page * 20)
  }

  async findByBrand(query: string, page: number): Promise<Asset[]> {
    return this.items
      .filter((item) => item.brand.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async findByModel(query: string, page: number): Promise<Asset[]> {
    return this.items
      .filter((item) => item.model.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }
}
