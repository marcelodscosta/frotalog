import { randomUUID } from 'crypto'
import { Invoice, InvoiceStatus, Prisma } from '../../generated/prisma'
import { IInvoiceRepository } from '../interfaces/IInvoiceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryInvoiceRepository implements IInvoiceRepository {
  public items: Invoice[] = []

  async create(
    data: Prisma.InvoiceUncheckedCreateInput,
  ): Promise<Invoice> {
    const invoice: any = {
      id: data.id ?? randomUUID(),
      invoice_number: data.invoice_number,
      issue_date:
        data.issue_date instanceof Date
          ? data.issue_date
          : new Date(data.issue_date as string),
      due_date:
        data.due_date instanceof Date
          ? data.due_date
          : new Date(data.due_date as string),
      total_value: new Prisma.Decimal(data.total_value.toString()),
      is_paid: data.is_paid ?? false,
      payment_date: data.payment_date
        ? data.payment_date instanceof Date
          ? data.payment_date
          : new Date(data.payment_date as string)
        : null,
      status: (data.status as InvoiceStatus) ?? 'PENDING',
      notes: data.notes ?? null,
      is_active: data.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
      measurementBulletins: [], // Initialize empty
    }
    
    // Simple mock for connect logic if it's in data
    if (data.measurementBulletins?.connect) {
        const connects = data.measurementBulletins.connect as any[]
        invoice.measurementBulletins = connects.map(c => ({ id: c.id }))
    }

    this.items.push(invoice)
    return invoice
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.items.find((i) => i.id === id) ?? null
  }

  async findByIdWithDetails(id: string): Promise<Invoice | null> {
    return this.items.find((i) => i.id === id) ?? null
  }

  async findAll(page: number): Promise<PaginatedResult<Invoice>> {
    const PAGE_SIZE = 20
    const active = this.items.filter((i) => i.is_active)
    const skip = (page - 1) * PAGE_SIZE
    const paged = active.slice(skip, skip + PAGE_SIZE)
    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: active.length,
      totalPages: Math.ceil(active.length / PAGE_SIZE),
    }
  }

  async findMany(options: {
    page: number
    status?: InvoiceStatus
    contractId?: string
    assetId?: string
  }): Promise<PaginatedResult<Invoice>> {
    const PAGE_SIZE = 20
    let filtered = this.items.filter((i) => i.is_active)
    if (options.status) {
      filtered = filtered.filter((i) => i.status === options.status)
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

  async findByStatus(
    status: InvoiceStatus,
    page: number,
  ): Promise<PaginatedResult<Invoice>> {
    return this.findMany({ page, status })
  }

  async update(
    id: string,
    data: Prisma.InvoiceUpdateInput,
  ): Promise<Invoice> {
    const index = this.items.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Invoice not found')
    const existing = this.items[index]
    const updated: Invoice = {
      ...existing,
      is_paid:
        typeof data.is_paid === 'boolean'
          ? data.is_paid
          : existing.is_paid,
      payment_date:
        data.payment_date !== undefined
          ? data.payment_date instanceof Date
            ? data.payment_date
            : data.payment_date === null
              ? null
              : existing.payment_date
          : existing.payment_date,
      status:
        typeof data.status === 'string'
          ? (data.status as InvoiceStatus)
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

  async delete(id: string): Promise<Invoice> {
    const index = this.items.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Invoice not found')
    this.items[index] = {
      ...this.items[index],
      is_active: false,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async findByMeasurementBulletinId(
    measurementBulletinId: string,
  ): Promise<Invoice | null> {
    // In memory we need to simulate the relation or just check items if we mocked them
    // For simplicity in tests, we can assume the invoice list might havebulletins attached if we manually mock them
    // But standard Prisma types for Invoice don't include the relation in the base object unless 'include' is used.
    // However, our repository implementation for Prisma DOES find it.
    
    // For the in-memory repo, if we want to support this, we might need a way to mock the relation.
    // Let's assume for now we look for any invoice that "would" have it.
    // Since we can't easily track back-references in a simple in-memory repo without more boilerplate,
    // let's just return null or implement a simple check if we added a mock 'measurementBulletins' array to the items.
    
    return (this.items as any).find((i: any) => 
        i.measurementBulletins?.some((mb: any) => mb.id === measurementBulletinId)
    ) ?? null
  }
}
