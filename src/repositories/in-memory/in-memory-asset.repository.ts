import { Prisma, Asset } from '../../generated/prisma'
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
}
