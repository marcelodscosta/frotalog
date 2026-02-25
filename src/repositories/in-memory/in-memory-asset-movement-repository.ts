import { randomUUID } from 'crypto'
import {
  AssetMovement,
  BillingCycle,
  Prisma,
} from '../../generated/prisma'
import { IAssetMovementRepository } from '../interfaces/IAssetMovimentRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryAssetMovementRepository
  implements IAssetMovementRepository
{
  public items: AssetMovement[] = []

  async create(
    data: Prisma.AssetMovementUncheckedCreateInput,
  ): Promise<AssetMovement> {
    const movement: AssetMovement = {
      id: data.id ?? randomUUID(),
      contractId: data.contractId,
      assetId: data.assetId,
      mobilization_date: data.mobilization_date
        ? data.mobilization_date instanceof Date
          ? data.mobilization_date
          : new Date(data.mobilization_date)
        : new Date(),
      integration_date: data.integration_date
        ? data.integration_date instanceof Date
          ? data.integration_date
          : new Date(data.integration_date)
        : null,
      demobilization_date: data.demobilization_date
        ? data.demobilization_date instanceof Date
          ? data.demobilization_date
          : new Date(data.demobilization_date)
        : null,
      mobilization_checklist_url:
        data.mobilization_checklist_url ?? null,
      demobilization_checklist_url:
        data.demobilization_checklist_url ?? null,
      rental_value: new Prisma.Decimal(
        data.rental_value.toString(),
      ),
      billing_cycle:
        (data.billing_cycle as BillingCycle) ?? 'MONTHLY',
      operator_name: data.operator_name ?? null,
      current_horometer: data.current_horometer ?? null,
      current_odometer: data.current_odometer ?? null,
      delivery_location: data.delivery_location ?? null,
      freight_value: data.freight_value
        ? new Prisma.Decimal(data.freight_value.toString())
        : null,
      notes: data.notes ?? null,
      is_active: data.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(movement)
    return movement
  }

  async updateAssetMovement(
    id: string,
    data: Prisma.AssetMovementUpdateInput,
  ): Promise<AssetMovement> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Asset movement not found')
    }
    const existing = this.items[index]
    const updated: AssetMovement = {
      ...existing,
      operator_name:
        data.operator_name !== undefined
          ? typeof data.operator_name === 'string'
            ? data.operator_name
            : null
          : existing.operator_name,
      notes:
        data.notes !== undefined
          ? typeof data.notes === 'string'
            ? data.notes
            : null
          : existing.notes,
      delivery_location:
        data.delivery_location !== undefined
          ? typeof data.delivery_location === 'string'
            ? data.delivery_location
            : null
          : existing.delivery_location,
      is_active:
        typeof data.is_active === 'boolean'
          ? data.is_active
          : existing.is_active,
      updated_at: new Date(),
    }
    this.items[index] = updated
    return updated
  }

  async findById(id: string): Promise<AssetMovement | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async deleteAssetMovement(id: string): Promise<AssetMovement> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Asset movement not found')
    }
    this.items[index] = {
      ...this.items[index],
      is_active: false,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async findAll(page: number): Promise<PaginatedResult<AssetMovement>> {
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

  async findAllUnpaginated(): Promise<AssetMovement[]> {
    return this.items
  }

  async findByContractId(
    contractId: string,
    page: number,
  ): Promise<PaginatedResult<AssetMovement>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter(
      (item) => item.contractId === contractId,
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

  async findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<AssetMovement>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter(
      (item) => item.assetId === assetId,
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

  async findActiveByAssetId(
    assetId: string,
  ): Promise<AssetMovement | null> {
    return (
      this.items.find(
        (item) => item.assetId === assetId && item.is_active,
      ) ?? null
    )
  }

  async findByAssetAndContract(
    assetId: string,
    contractId: string,
  ): Promise<AssetMovement | null> {
    return (
      this.items.find(
        (item) =>
          item.assetId === assetId && item.contractId === contractId,
      ) ?? null
    )
  }

  async findActiveByAssetAndContract(
    assetId: string,
    contractId: string,
  ): Promise<AssetMovement | null> {
    return (
      this.items.find(
        (item) =>
          item.assetId === assetId &&
          item.contractId === contractId &&
          item.is_active,
      ) ?? null
    )
  }

  async findActiveNotDemobilizedByAssetId(
    assetId: string,
  ): Promise<AssetMovement | null> {
    return (
      this.items.find(
        (item) =>
          item.assetId === assetId &&
          item.is_active &&
          !item.demobilization_date,
      ) ?? null
    )
  }

  async search(params: {
    assetId?: string
    contractId?: string
    billingCycle?: BillingCycle
    isActive?: boolean
    mobilizationDateFrom?: Date
    mobilizationDateTo?: Date
    page: number
    unpaginated?: boolean
  }): Promise<PaginatedResult<AssetMovement>> {
    const PAGE_SIZE = 20
    let filtered = [...this.items]

    if (params.assetId) {
      filtered = filtered.filter(
        (item) => item.assetId === params.assetId,
      )
    }
    if (params.contractId) {
      filtered = filtered.filter(
        (item) => item.contractId === params.contractId,
      )
    }
    if (params.billingCycle) {
      filtered = filtered.filter(
        (item) => item.billing_cycle === params.billingCycle,
      )
    }
    if (params.isActive !== undefined) {
      filtered = filtered.filter(
        (item) => item.is_active === params.isActive,
      )
    }
    if (params.mobilizationDateFrom) {
      filtered = filtered.filter(
        (item) =>
          item.mobilization_date >= params.mobilizationDateFrom!,
      )
    }
    if (params.mobilizationDateTo) {
      filtered = filtered.filter(
        (item) =>
          item.mobilization_date <= params.mobilizationDateTo!,
      )
    }

    const skip = params.unpaginated ? 0 : (params.page - 1) * PAGE_SIZE
    const paged = params.unpaginated ? filtered : filtered.slice(skip, skip + PAGE_SIZE)
    const totalItems = filtered.length
    const totalPages = params.unpaginated ? 1 : Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: params.unpaginated ? 1 : params.page,
      pageSize: params.unpaginated ? totalItems : PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async updateBillingCycle(
    id: string,
    billingCycle: BillingCycle,
  ): Promise<AssetMovement> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Asset movement not found')
    }
    this.items[index] = {
      ...this.items[index],
      billing_cycle: billingCycle,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async updateMovementDates(
    id: string,
    integrationDate?: Date,
    demobilizationDate?: Date,
  ): Promise<AssetMovement> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Asset movement not found')
    }
    if (integrationDate !== undefined) {
      this.items[index].integration_date = integrationDate
    }
    if (demobilizationDate !== undefined) {
      this.items[index].demobilization_date = demobilizationDate
    }
    this.items[index].updated_at = new Date()
    return this.items[index]
  }

  async getAssetMovementsSummaryByContract(
    contractId: string,
  ): Promise<AssetMovement[]> {
    return this.items.filter(
      (item) => item.contractId === contractId,
    )
  }

  async getActiveMovementsByAsset(
    assetId: string,
  ): Promise<AssetMovement[]> {
    return this.items.filter(
      (item) => item.assetId === assetId && item.is_active,
    )
  }

  async getAssetMovementWithDetails(
    id: string,
  ): Promise<AssetMovement | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
