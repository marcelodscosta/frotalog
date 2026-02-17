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
        measurementBulletin: {
          include: {
            contract: { include: { client: true } },
            assetMovement: { include: { asset: true } },
            expenses: { orderBy: { created_at: 'asc' } },
          },
        },
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
          measurementBulletin: {
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
  }: {
    page: number
    status?: InvoiceStatus
    contractId?: string
    assetId?: string
  }): Promise<PaginatedResult<Invoice>> {
    const skip = (page - 1) * this.PAGE_SIZE
    const where: Prisma.InvoiceWhereInput = {
      is_active: true,
      ...(status && { status }),
      ...(contractId && {
        measurementBulletin: {
          contractId,
        },
      }),
      ...(assetId && {
        measurementBulletin: {
          assetMovement: {
            assetId,
          },
        },
      }),
    }

    const [items, totalItems] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          measurementBulletin: {
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
    return prisma.invoice.findUnique({
      where: { measurementBulletinId },
    })
  }
}
