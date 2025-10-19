import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository } from '../interfaces/IMaintenanceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryMaintenanceRepository implements IMaintenanceRepository {
  public maintenances: Maintenance[] = []

  async create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance> {
    const maintenance: Maintenance = {
      id: crypto.randomUUID(),
      assetId: data.asset.connect?.id || '',
      supplierId: data.supplier.connect?.id || '',
      type: data.type,
      description: data.description,
      scheduled_date:
        typeof data.scheduled_date === 'string'
          ? new Date(data.scheduled_date)
          : data.scheduled_date,
      started_date: data.started_date
        ? typeof data.started_date === 'string'
          ? new Date(data.started_date)
          : data.started_date
        : null,
      completed_date: data.completed_date
        ? typeof data.completed_date === 'string'
          ? new Date(data.completed_date)
          : data.completed_date
        : null,
      estimated_cost: data.estimated_cost
        ? new Prisma.Decimal(data.estimated_cost as any)
        : null,
      actual_cost: data.actual_cost
        ? new Prisma.Decimal(data.actual_cost as any)
        : null,
      status: data.status || 'SCHEDULED',
      notes: data.notes || null,
      created_at: new Date(),
      updated_at: new Date(),
      is_Active: true,
      // @ts-ignore - These will be populated by includes
      asset: null,
      supplier: null,
      documents: [],
    }

    this.maintenances.push(maintenance)
    return maintenance
  }

  async updateMaintenance(
    id: string,
    data: Prisma.MaintenanceUpdateInput,
  ): Promise<Maintenance> {
    const maintenanceIndex = this.maintenances.findIndex(
      (maintenance) => maintenance.id === id,
    )

    if (maintenanceIndex === -1) {
      throw new Error('Maintenance not found')
    }

    const maintenance = this.maintenances[maintenanceIndex]
    const updatedMaintenance = {
      ...maintenance,
      ...data,
      updated_at: new Date(),
    }

    this.maintenances[maintenanceIndex] = updatedMaintenance as Maintenance
    return updatedMaintenance as Maintenance
  }

  async findById(id: string): Promise<Maintenance | null> {
    const maintenance = this.maintenances.find(
      (maintenance) => maintenance.id === id,
    )
    return maintenance || null
  }

  async findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesByAsset = this.maintenances.filter(
      (maintenance) => maintenance.is_Active && maintenance.assetId === assetId,
    )
    const totalCount = activeMaintenancesByAsset.length

    const maintenances = activeMaintenancesByAsset
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findBySupplierId(
    supplierId: string,
    page: number,
  ): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesBySupplier = this.maintenances.filter(
      (maintenance) =>
        maintenance.is_Active && maintenance.supplierId === supplierId,
    )
    const totalCount = activeMaintenancesBySupplier.length

    const maintenances = activeMaintenancesBySupplier
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByStatus(
    status: Prisma.MaintenanceStatus,
    page: number,
  ): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesByStatus = this.maintenances.filter(
      (maintenance) => maintenance.is_Active && maintenance.status === status,
    )
    const totalCount = activeMaintenancesByStatus.length

    const maintenances = activeMaintenancesByStatus
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByType(
    type: Prisma.MaintenanceType,
    page: number,
  ): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesByType = this.maintenances.filter(
      (maintenance) => maintenance.is_Active && maintenance.type === type,
    )
    const totalCount = activeMaintenancesByType.length

    const maintenances = activeMaintenancesByType
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAll(page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenances = this.maintenances.filter(
      (maintenance) => maintenance.is_Active,
    )
    const totalCount = activeMaintenances.length

    const maintenances = activeMaintenances
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findScheduledMaintenances(
    page: number,
  ): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const now = new Date()

    const scheduledMaintenances = this.maintenances.filter(
      (maintenance) =>
        maintenance.is_Active &&
        maintenance.status === 'SCHEDULED' &&
        maintenance.scheduled_date >= now,
    )
    const totalCount = scheduledMaintenances.length

    const maintenances = scheduledMaintenances
      .sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findOverdueMaintenances(
    page: number,
  ): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const now = new Date()

    const overdueMaintenances = this.maintenances.filter(
      (maintenance) =>
        maintenance.is_Active &&
        maintenance.status === 'SCHEDULED' &&
        maintenance.scheduled_date < now,
    )
    const totalCount = overdueMaintenances.length

    const maintenances = overdueMaintenances
      .sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async updateStatus(
    id: string,
    status: Prisma.MaintenanceStatus,
  ): Promise<Maintenance> {
    const maintenanceIndex = this.maintenances.findIndex(
      (maintenance) => maintenance.id === id,
    )

    if (maintenanceIndex === -1) {
      throw new Error('Maintenance not found')
    }

    const updateData: any = { status }

    if (status === 'IN_PROGRESS') {
      updateData.started_date = new Date()
    } else if (status === 'COMPLETED') {
      updateData.completed_date = new Date()
    }

    this.maintenances[maintenanceIndex] = {
      ...this.maintenances[maintenanceIndex],
      ...updateData,
      updated_at: new Date(),
    }

    return this.maintenances[maintenanceIndex]
  }

  async updateCosts(
    id: string,
    estimatedCost?: number,
    actualCost?: number,
  ): Promise<Maintenance> {
    const maintenanceIndex = this.maintenances.findIndex(
      (maintenance) => maintenance.id === id,
    )

    if (maintenanceIndex === -1) {
      throw new Error('Maintenance not found')
    }

    const updateData: any = {}

    if (estimatedCost !== undefined) {
      updateData.estimated_cost = estimatedCost
    }
    if (actualCost !== undefined) {
      updateData.actual_cost = actualCost
    }

    this.maintenances[maintenanceIndex] = {
      ...this.maintenances[maintenanceIndex],
      ...updateData,
      updated_at: new Date(),
    }

    return this.maintenances[maintenanceIndex]
  }

  async deactivateMaintenance(id: string): Promise<Maintenance> {
    const maintenanceIndex = this.maintenances.findIndex(
      (maintenance) => maintenance.id === id,
    )

    if (maintenanceIndex === -1) {
      throw new Error('Maintenance not found')
    }

    this.maintenances[maintenanceIndex] = {
      ...this.maintenances[maintenanceIndex],
      is_Active: false,
      updated_at: new Date(),
    }

    return this.maintenances[maintenanceIndex]
  }

  async activateMaintenance(id: string): Promise<Maintenance> {
    const maintenanceIndex = this.maintenances.findIndex(
      (maintenance) => maintenance.id === id,
    )

    if (maintenanceIndex === -1) {
      throw new Error('Maintenance not found')
    }

    this.maintenances[maintenanceIndex] = {
      ...this.maintenances[maintenanceIndex],
      is_Active: true,
      updated_at: new Date(),
    }

    return this.maintenances[maintenanceIndex]
  }
}
