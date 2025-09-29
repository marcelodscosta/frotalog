import { randomUUID } from 'crypto'
import { Prisma, AssetCategory } from '../../generated/prisma'
import { IAssetCategoryRepository } from '../interfaces/IAssetCategoryRepository'
import { AssetCategoryNotFoundError } from '../../services/errors/asset-category-not-found-error'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

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

  async searchAssetCategory(
    query: string,
    page: number,
  ): Promise<PaginatedResult<AssetCategory>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    )
    const skip = (page - 1) * PAGE_SIZE
    const paged = filtered.slice(skip, skip + PAGE_SIZE)
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
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
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new AssetCategoryNotFoundError()
    }
    const existing = this.items[index]
    const updated = {
      ...existing,
      ...data,
      updated_at: new Date(),
    }
    this.items[index] = updated as AssetCategory
    return this.items[index]
  }

  async findAll(page: number): Promise<PaginatedResult<AssetCategory>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const paged = this.items.slice(skip, skip + PAGE_SIZE)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }
}
