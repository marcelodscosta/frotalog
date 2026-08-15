import { Commission, CommissionStatus } from '../../generated/prisma'

export interface CommissionFilters {
  sellerId?: string
  contractId?: string
  status?: CommissionStatus
  year?: number
  month?: number // 1-12
}

export interface ICommissionRepository {
  create(data: {
    contractId: string
    sellerId: string
    measurementBulletinId?: string
    reference_month: Date
    base_value: number
    commission_percentage: number
    commission_value: number
    notes?: string
  }): Promise<Commission>

  findById(id: string): Promise<Commission | null>

  findByMeasurementBulletin(measurementBulletinId: string): Promise<Commission | null>

  search(filters: CommissionFilters): Promise<{
    items: Commission[]
    totalItems: number
    totalPages: number
    currentPage: number
  }>

  updateStatus(id: string, status: CommissionStatus, paid_at?: Date): Promise<Commission>

  getSummary(filters: CommissionFilters): Promise<{
    totalValue: number
    totalPending: number
    totalConfirmed: number
    totalPaid: number
    count: number
  }>
}
