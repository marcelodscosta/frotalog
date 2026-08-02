import { Prisma, Asset } from '../../generated/prisma'
import { AssetNotFoundError } from '../../services/errors/asset-not-found-error'
import { IAssetRepository } from '../interfaces/IAssetRepository'
import { randomUUID } from 'crypto'

import { PaginatedResult } from '../interfaces/IPaginatedResult'

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
      assetCategoryId: data.assetCategoryId ?? 'mock-category',
      current_horometer: data.current_horometer ?? null,
      current_odometer: data.current_odometer ?? null,
      initial_horometer: data.initial_horometer ?? null,
      initial_odometer: data.initial_odometer ?? null,
      maintenance_frequency_hours: data.maintenance_frequency_hours ?? null,
      maintenance_frequency_km: data.maintenance_frequency_km ?? null,
      last_maintenance_date: data.last_maintenance_date ? new Date(data.last_maintenance_date) : null,
      last_maintenance_horometer: data.last_maintenance_horometer ?? null,
      last_maintenance_odometer: data.last_maintenance_odometer ?? null,
      documentsUrl: data.documentsUrl ?? null,
      notes: data.notes ?? null,
      ownership: data.ownership ?? 'OWN',
    } as Asset
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

  async findAll(page: number): Promise<PaginatedResult<Asset>> {
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

  async findByBrand(
    query: string,
    page: number,
  ): Promise<PaginatedResult<Asset>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter((item) =>
      item.brand.toLowerCase().includes(query.toLowerCase()),
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

  async findByModel(
    query: string,
    page: number,
  ): Promise<PaginatedResult<Asset>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter((item) =>
      item.model.toLowerCase().includes(query.toLowerCase()),
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

  async findAllUnpaginated(): Promise<Asset[]> {
    return this.items.filter((item) => item.is_Active === true)
  }

  async updateAssetIsActive(id: string, is_Active: boolean): Promise<Asset> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new AssetNotFoundError()
    }
    this.items[index].is_Active = is_Active
    return this.items[index]
  }

  async search(params: any): Promise<PaginatedResult<Asset>> {
    return {
      items: this.items,
      currentPage: 1,
      pageSize: 20,
      totalItems: this.items.length,
      totalPages: 1,
    }
  }
}
