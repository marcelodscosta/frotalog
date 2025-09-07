import { randomUUID } from 'crypto'
import { Prisma, AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../interfaces/IAssetCategoryRepository'

export class InMemoryAssetCategoryRepository
  implements IAssetCategoryRepository
{
  public items: AssetCategory[] = []

  async create(data: Prisma.AssetCategoryCreateInput): Promise<AssetCategory> {
    const assetCategory = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      type: data.type,
      created_at: new Date(),
      updated_at: data.updated_at as Date,
      is_Active: data.is_Active ?? true,
    }
    this.items.push(assetCategory)

    return assetCategory
  }

  async findById(id: string): Promise<AssetCategory | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
