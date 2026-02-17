import { Invoice, Prisma, InvoiceStatus } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IInvoiceRepository {
  create(data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>
  findById(id: string): Promise<Invoice | null>
  findAll(page: number): Promise<PaginatedResult<Invoice>>
  findByStatus(
    status: InvoiceStatus,
    page: number,
  ): Promise<PaginatedResult<Invoice>>
  update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice>
  delete(id: string): Promise<Invoice>
  findByIdWithDetails(id: string): Promise<Invoice | null>
  findByMeasurementBulletinId(
    measurementBulletinId: string,
  ): Promise<Invoice | null>
}
