import { Maintenance, Prisma } from '../../generated/prisma'
import { IMaintenanceRepository, MaintenanceWithRelations } from '../interfaces/IMaintenanceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryMaintenanceRepository implements IMaintenanceRepository {
  public maintenances: Maintenance[] = []

  private mapToWithRelations(maintenance: Maintenance): MaintenanceWithRelations {
    return {
      ...maintenance,
      asset: { brand: 'Mock', model: 'Mock', plate: 'MOC-0000', serial_number: '123', year: 2024 },
      supplier: { company_name: 'Mock Supplier', trading_name: null },
      serviceCategory: { id: 'mock-category', name: 'Mock Category', description: null },
    }
  }

  async create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance> {
    const maintenance: Maintenance = {
      id: crypto.randomUUID(),
      assetId: data.asset.connect?.id || '',
      supplierId: data.supplier?.connect?.id || '',
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
      equipment_inactive: (data as any).equipment_inactive ?? false,
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

  async findById(id: string): Promise<MaintenanceWithRelations | null> {
    const maintenance = this.maintenances.find(
      (maintenance) => maintenance.id === id,
    )
    return maintenance ? this.mapToWithRelations(maintenance) : null
  }

  async findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesByAsset = this.maintenances.filter(
      (maintenance) => maintenance.is_Active && maintenance.assetId === assetId,
    )
    const totalCount = activeMaintenancesByAsset.length

    const maintenances = activeMaintenancesByAsset
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)
      .map(this.mapToWithRelations.bind(this))

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
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
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
      .map(this.mapToWithRelations.bind(this))

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
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesByStatus = this.maintenances.filter(
      (maintenance) => maintenance.is_Active && maintenance.status === status,
    )
    const totalCount = activeMaintenancesByStatus.length

    const maintenances = activeMaintenancesByStatus
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)
      .map(this.mapToWithRelations.bind(this))

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
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY',
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenancesByType = this.maintenances.filter(
      (maintenance) => maintenance.is_Active && maintenance.type === type,
    )
    const totalCount = activeMaintenancesByType.length

    const maintenances = activeMaintenancesByType
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)
      .map(this.mapToWithRelations.bind(this))

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAll(page: number): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeMaintenances = this.maintenances.filter(
      (maintenance) => maintenance.is_Active,
    )
    const totalCount = activeMaintenances.length

    const maintenances = activeMaintenances
      .sort((a, b) => b.scheduled_date.getTime() - a.scheduled_date.getTime())
      .slice(skip, skip + PAGE_SIZE)
      .map(this.mapToWithRelations.bind(this))

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
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
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
      .map(this.mapToWithRelations.bind(this))

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
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
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
      .map(this.mapToWithRelations.bind(this))

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
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    horometer?: number,
    odometer?: number,
    actualCost?: number,
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

  async findMaintenancesByAssetPeriod(
    assetId: string | undefined,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    return this.maintenances.filter((m) => {
      if (!m.is_Active) return false
      if (assetId && m.assetId !== assetId) return false

      const scheduledDate = m.scheduled_date
      const completedDate = m.completed_date

      // Check if maintenance overlaps with the period
      const mStart = m.started_date || scheduledDate
      const mEnd = completedDate || endDate

      return mStart <= endDate && mEnd >= startDate
    }).map((m) => ({
      ...m,
      supplier: { company_name: 'Test Supplier' },
      asset: { brand: 'Test', model: 'Model', plate: 'ABC-1234', year: 2024 },
      serviceCategory: null,
    }))
  }

  async findScheduledOnly(params?: { startDate?: Date; endDate?: Date }): Promise<Maintenance[]> {
    return this.maintenances.filter((m) => {
      if (!m.is_Active) return false
      if (m.status !== 'SCHEDULED') return false
      if (params?.startDate && m.scheduled_date < params.startDate) return false
      if (params?.endDate && m.scheduled_date > params.endDate) return false
      return true
    })
  }

  async updateCompletedDate(id: string): Promise<Maintenance> {
    const index = this.maintenances.findIndex((m) => m.id === id)
    if (index === -1) throw new Error('Maintenance not found')
    this.maintenances[index] = {
      ...this.maintenances[index],
      completed_date: new Date(),
      updated_at: new Date(),
    }
    return this.maintenances[index]
  }

  async findMaintenancesByPlate(
    plate: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const result = await this.findAll(page)
    const filteredItems = result.items.filter(m => m.asset.plate === plate)
    return { ...result, items: filteredItems, totalItems: filteredItems.length }
  }

  async findMaintenancesBySerialNumber(
    serialNumber: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const result = await this.findAll(page)
    const filteredItems = result.items.filter(m => m.asset.serial_number === serialNumber)
    return { ...result, items: filteredItems, totalItems: filteredItems.length }
  }
}
