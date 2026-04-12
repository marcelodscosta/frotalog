import { Invoice, Prisma, InvoiceStatus } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IInvoiceRepository } from '../interfaces/IInvoiceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaInvoiceRepository implements IInvoiceRepository {
  private readonly PAGE_SIZE = 20

  async create(data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice> {
    return prisma.invoice.create({ data })
  }

  async findById(id: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({ where: { id } })
  }

  async findByIdWithDetails(id: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        measurementBulletins: {
          include: {
            contract: { include: { client: true } },
            assetMovement: { include: { asset: true } },
            expenses: { orderBy: { created_at: 'asc' } },
          },
        },
        transactions: true,
      },
    })
  }

  async findAll(page: number): Promise<PaginatedResult<Invoice>> {
    const skip = (page - 1) * this.PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.invoice.findMany({
        where: { is_active: true },
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          measurementBulletins: {
            include: {
              contract: { include: { client: true } },
              assetMovement: { include: { asset: true } },
              expenses: { orderBy: { created_at: 'asc' } },
            },
          },
        },
      }),
      prisma.invoice.count({ where: { is_active: true } }),
    ])

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages: Math.ceil(totalItems / this.PAGE_SIZE),
    }
  }

  async findMany({
    page,
    status,
    contractId,
    assetId,
    month,
    year,
    search,
  }: {
    page: number
    status?: InvoiceStatus
    contractId?: string
    assetId?: string
    month?: number
    year?: number
    search?: string
  }): Promise<PaginatedResult<Invoice>> {
    const skip = (page - 1) * this.PAGE_SIZE

    const where: Prisma.InvoiceWhereInput = {
      is_active: true,
      ...(status && { status }),
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      where.due_date = { gte: startDate, lte: endDate }
    }

    if (contractId || assetId || search) {
      where.measurementBulletins = {
        some: {
          ...(contractId && { contractId }),
          ...(assetId && { assetMovement: { assetId } }),
          ...(search && {
            OR: [
              { contract: { contract_number: { contains: search, mode: 'insensitive' } } },
              { contract: { client: { company_name: { contains: search, mode: 'insensitive' } } } },
              { contract: { client: { trading_name: { contains: search, mode: 'insensitive' } } } },
            ],
          }),
        },
      }
    }

    if (search && !where.measurementBulletins?.some?.OR) {
      // If searching but no measurement bulletin filter was applied, search invoice number directly
      where.invoice_number = { contains: search, mode: 'insensitive' }
    } else if (search && where.measurementBulletins?.some?.OR) {
      // If searching both, use OR at the root level
      const mbFilter = where.measurementBulletins
      delete where.measurementBulletins
      where.OR = [
        { invoice_number: { contains: search, mode: 'insensitive' } },
        { measurementBulletins: mbFilter },
      ]
    }

    const [items, totalItems] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          measurementBulletins: {
            include: {
              contract: { include: { client: true } },
              assetMovement: { include: { asset: true } },
              expenses: { orderBy: { created_at: 'asc' } },
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ])

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages: Math.ceil(totalItems / this.PAGE_SIZE),
    }
  }

  async findByStatus(
    status: InvoiceStatus,
    page: number,
  ): Promise<PaginatedResult<Invoice>> {
    // Deprecated in favor of findMany, but kept for compatibility if needed
    return this.findMany({ page, status })
  }

  async update(
    id: string,
    data: Prisma.InvoiceUpdateInput,
  ): Promise<Invoice> {
    return prisma.invoice.update({ where: { id }, data })
  }

  async delete(id: string): Promise<Invoice> {
    return prisma.invoice.update({
      where: { id },
      data: { is_active: false },
    })
  }

  async findByMeasurementBulletinId(
    measurementBulletinId: string,
  ): Promise<Invoice | null> {
    const bulletin = await prisma.measurementBulletin.findUnique({
      where: { id: measurementBulletinId },
      include: { invoice: true },
    })

    return bulletin?.invoice || null
  }

  async getSummary(month: number, year: number): Promise<{ overdue: number; due_today: number; upcoming: number; paid: number; total: number }> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const invoices = await prisma.invoice.findMany({
      where: {
        is_active: true,
        due_date: { gte: startDate, lte: endDate },
      },
    })

    let overdue = 0
    let due_today = 0
    let upcoming = 0
    let paid = 0

    for (const inv of invoices) {
      const value = Number(inv.total_value)
      if (inv.is_paid || inv.status === 'PAID') {
        paid += value
      } else if (inv.due_date < today) {
        overdue += value
      } else if (inv.due_date >= today && inv.due_date <= todayEnd) {
        due_today += value
      } else {
        upcoming += value
      }
    }

    return {
      overdue,
      due_today,
      upcoming,
      paid,
      total: overdue + due_today + upcoming + paid,
    }
  }

  async receive(id: string, data: { payment_date: Date; bankAccountId: string; chartOfAccountId?: string; amount: number }) {
    return prisma.$transaction(async (tx) => {
      // Create the financial transaction
      await tx.financialTransaction.create({
        data: {
          type: 'INCOME',
          amount: data.amount,
          date: data.payment_date,
          bankAccountId: data.bankAccountId,
          invoiceId: id,
          description: `Recebimento de Fatura`,
        }
      })

      // Update the bank account balance
      await tx.bankAccount.update({
        where: { id: data.bankAccountId },
        data: { balance: { increment: data.amount } }
      })

      // Update the Invoice
      const updatedInvoice = await tx.invoice.update({
        where: { id },
        data: {
          status: 'PAID',
          is_paid: true,
          payment_date: data.payment_date,
          chartOfAccountId: data.chartOfAccountId,
        }
      })

      return updatedInvoice
    })
  }
}
