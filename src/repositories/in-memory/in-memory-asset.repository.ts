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
      assetCategoryId: data.assetCategoryId ?? null,
      current_horometer: data.current_horometer ?? null,
      current_odometer: data.current_odometer ?? null,
      last_maintenance_date: data.last_maintenance_date ? new Date(data.last_maintenance_date) : null,
      last_maintenance_horometer: data.last_maintenance_horometer ?? null,
      last_maintenance_odometer: data.last_maintenance_odometer ?? null,
      status: data.status ?? 'AVAILABLE',
      acquisition_date: data.acquisition_date ? new Date(data.acquisition_date) : null,
      acquisition_value: data.acquisition_value ?? null,
      invoice_number: data.invoice_number ?? null,
      notes: data.notes ?? null,
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
}
