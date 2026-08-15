import { Commission, CommissionStatus, Prisma } from '../../generated/prisma'
import { ICommissionRepository, CommissionFilters } from '../interfaces/ICommissionRepository'
import { randomUUID } from 'crypto'

export class InMemoryCommissionRepository implements ICommissionRepository {
  public items: Commission[] = []

  async create(data: {
    contractId: string
    sellerId: string
    measurementBulletinId?: string
    reference_month: Date
    base_value: number
    commission_percentage: number
    commission_value: number
    notes?: string
  }): Promise<Commission> {
    const commission: Commission = {
      id: randomUUID(),
      contractId: data.contractId,
      sellerId: data.sellerId,
      measurementBulletinId: data.measurementBulletinId || null,
      reference_month: data.reference_month,
      base_value: new Prisma.Decimal(data.base_value),
      commission_percentage: new Prisma.Decimal(data.commission_percentage),
      commission_value: new Prisma.Decimal(data.commission_value),
      notes: data.notes || null,
      status: 'PENDING',
      paid_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(commission)
    return commission
  }

  async findById(id: string): Promise<Commission | null> {
    const item = this.items.find((item) => item.id === id)
    return item || null
  }

  async findByMeasurementBulletin(measurementBulletinId: string): Promise<Commission | null> {
    const item = this.items.find((item) => item.measurementBulletinId === measurementBulletinId)
    return item || null
  }

  async search(filters: CommissionFilters): Promise<{
    items: Commission[]
    totalItems: number
    totalPages: number
    currentPage: number
  }> {
    return {
      items: this.items,
      totalItems: this.items.length,
      totalPages: 1,
      currentPage: 1,
    }
  }

  async updateStatus(id: string, status: CommissionStatus, paid_at?: Date): Promise<Commission> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Not found')
    
    this.items[index].status = status
    if (paid_at) this.items[index].paid_at = paid_at
    
    return this.items[index]
  }

  async getSummary(filters: CommissionFilters): Promise<{
    totalValue: number
    totalPending: number
    totalConfirmed: number
    totalPaid: number
    count: number
  }> {
    return {
      totalValue: 0,
      totalPending: 0,
      totalConfirmed: 0,
      totalPaid: 0,
      count: 0
    }
  }
}
