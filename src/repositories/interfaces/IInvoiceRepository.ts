import { Invoice, Prisma, InvoiceStatus } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IInvoiceRepository {
  create(data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>
  findById(id: string): Promise<Invoice | null>
  findAll(page: number): Promise<PaginatedResult<Invoice>>
  findMany(options: {
    page: number
    status?: InvoiceStatus
    contractId?: string
    assetId?: string
    month?: number
    year?: number
    search?: string
  }): Promise<PaginatedResult<Invoice>>
  getSummary(month: number, year: number): Promise<{
    overdue: number
    due_today: number
    upcoming: number
    paid: number
    total: number
  }>
  findByStatus(
    status: InvoiceStatus,
    page: number,
  ): Promise<PaginatedResult<Invoice>>
  receive(id: string, data: {
    payment_date: Date
    bankAccountId: string
    chartOfAccountId?: string
    amount: number
  }): Promise<Invoice>
  update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice>
  delete(id: string): Promise<Invoice>
  findByIdWithDetails(id: string): Promise<Invoice | null>
  findByMeasurementBulletinId(
    measurementBulletinId: string,
  ): Promise<Invoice | null>
}
