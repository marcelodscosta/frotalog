import { randomUUID } from 'crypto'
import {
  MeasurementBulletin,
  MeasurementBulletinStatus,
  Prisma,
} from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../interfaces/IMeasurementBulletinRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryMeasurementBulletinRepository
  implements IMeasurementBulletinRepository
{
  public items: MeasurementBulletin[] = []

  async create(
    data: Prisma.MeasurementBulletinUncheckedCreateInput,
  ): Promise<MeasurementBulletin> {
    const bulletin: MeasurementBulletin = {
      id: data.id ?? randomUUID(),
      contractId: data.contractId,
      assetMovementId: data.assetMovementId,
      reference_start:
        data.reference_start instanceof Date
          ? data.reference_start
          : new Date(data.reference_start),
      reference_end:
        data.reference_end instanceof Date
          ? data.reference_end
          : new Date(data.reference_end),
      total_days: data.total_days,
      inactive_days: data.inactive_days,
      working_days: data.working_days,
      daily_rate: new Prisma.Decimal(data.daily_rate.toString()),
      total_value: new Prisma.Decimal(data.total_value.toString()),
      current_horometer: data.current_horometer ?? null,
      current_odometer: data.current_odometer ?? null,
      status:
        (data.status as MeasurementBulletinStatus) ?? 'DRAFT',
      notes: data.notes ?? null,
      is_active: data.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(bulletin)
    return bulletin
  }

  async findById(id: string): Promise<MeasurementBulletin | null> {
    return this.items.find((i) => i.id === id) ?? null
  }

  async findByIdWithDetails(
    id: string,
  ): Promise<MeasurementBulletin | null> {
    return this.items.find((i) => i.id === id) ?? null
  }

  async findAll(
    page: number,
  ): Promise<PaginatedResult<MeasurementBulletin>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const paged = this.items.filter((i) => i.is_active).slice(skip, skip + PAGE_SIZE)
    const totalItems = this.items.filter((i) => i.is_active).length
    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages: Math.ceil(totalItems / PAGE_SIZE),
    }
  }

  async findMany(options: {
    page: number
    status?: MeasurementBulletinStatus
    contractId?: string
    assetId?: string
  }): Promise<PaginatedResult<MeasurementBulletin>> {
    const PAGE_SIZE = 20
    let filtered = this.items.filter((i) => i.is_active)
    if (options.status) {
      filtered = filtered.filter((i) => i.status === options.status)
    }
    if (options.contractId) {
      filtered = filtered.filter(
        (i) => i.contractId === options.contractId,
      )
    }
    const skip = (options.page - 1) * PAGE_SIZE
    const paged = filtered.slice(skip, skip + PAGE_SIZE)
    return {
      items: paged,
      currentPage: options.page,
      pageSize: PAGE_SIZE,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / PAGE_SIZE),
    }
  }

  async findByContractId(
    contractId: string,
    page: number,
  ): Promise<PaginatedResult<MeasurementBulletin>> {
    return this.findMany({ page, contractId })
  }

  async update(
    id: string,
    data: Prisma.MeasurementBulletinUpdateInput,
  ): Promise<MeasurementBulletin> {
    const index = this.items.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Bulletin not found')
    const existing = this.items[index]
    const updated: MeasurementBulletin = {
      ...existing,
      status:
        typeof data.status === 'string'
          ? (data.status as MeasurementBulletinStatus)
          : existing.status,
      notes:
        data.notes !== undefined
          ? typeof data.notes === 'string'
            ? data.notes
            : null
          : existing.notes,
      updated_at: new Date(),
    }
    this.items[index] = updated
    return updated
  }

  async delete(id: string): Promise<MeasurementBulletin> {
    const index = this.items.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Bulletin not found')
    this.items[index] = {
      ...this.items[index],
      is_active: false,
      updated_at: new Date(),
    }
    return this.items[index]
  }
}
