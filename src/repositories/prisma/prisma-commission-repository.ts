import { Commission, CommissionStatus, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { CommissionFilters, ICommissionRepository } from '../interfaces/ICommissionRepository'

export class PrismaCommissionRepository implements ICommissionRepository {
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
    return prisma.commission.create({
      data: {
        contractId: data.contractId,
        sellerId: data.sellerId,
        measurementBulletinId: data.measurementBulletinId,
        reference_month: data.reference_month,
        base_value: new Prisma.Decimal(data.base_value.toFixed(2)),
        commission_percentage: new Prisma.Decimal(data.commission_percentage.toFixed(2)),
        commission_value: new Prisma.Decimal(data.commission_value.toFixed(2)),
        notes: data.notes,
      },
    })
  }

  async findById(id: string): Promise<Commission | null> {
    return prisma.commission.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true, avatar: true } },
        contract: { include: { client: { select: { company_name: true } } } },
        measurementBulletin: { select: { id: true, reference_start: true, reference_end: true, total_value: true } },
      },
    })
  }

  async findByMeasurementBulletin(measurementBulletinId: string): Promise<Commission | null> {
    return prisma.commission.findUnique({ where: { measurementBulletinId } })
  }

  async search(filters: CommissionFilters): Promise<{
    items: Commission[]
    totalItems: number
    totalPages: number
    currentPage: number
  }> {
    const PAGE_SIZE = 20
    const where: Prisma.CommissionWhereInput = {}

    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.contractId) where.contractId = filters.contractId
    if (filters.status) where.status = filters.status

    if (filters.year || filters.month) {
      const year = filters.year ?? new Date().getFullYear()
      const month = filters.month ? filters.month - 1 : 0 // js month 0-indexed
      const start = new Date(Date.UTC(year, filters.month ? month : 0, 1))
      const end = filters.month
        ? new Date(Date.UTC(year, month + 1, 1))
        : new Date(Date.UTC(year + 1, 0, 1))
      where.reference_month = { gte: start, lt: end }
    }

    const [items, totalItems] = await prisma.$transaction([
      prisma.commission.findMany({
        where,
        include: {
          seller: { select: { id: true, name: true, avatar: true } },
          contract: { include: { client: { select: { id: true, company_name: true } } } },
          measurementBulletin: { select: { id: true, reference_start: true, reference_end: true, total_value: true } },
        },
        orderBy: [{ reference_month: 'desc' }, { created_at: 'desc' }],
      }),
      prisma.commission.count({ where }),
    ])

    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return { items, totalItems, totalPages, currentPage: 1 }
  }

  async updateStatus(id: string, status: CommissionStatus, paid_at?: Date): Promise<Commission> {
    return prisma.commission.update({
      where: { id },
      data: {
        status,
        paid_at: status === 'PAID' ? (paid_at ?? new Date()) : null,
      },
    })
  }

  async getSummary(filters: CommissionFilters): Promise<{
    totalValue: number
    totalPending: number
    totalConfirmed: number
    totalPaid: number
    count: number
  }> {
    const where: Prisma.CommissionWhereInput = {}
    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.contractId) where.contractId = filters.contractId
    if (filters.status) where.status = filters.status

    if (filters.year || filters.month) {
      const year = filters.year ?? new Date().getFullYear()
      const month = filters.month ? filters.month - 1 : 0
      const start = new Date(Date.UTC(year, filters.month ? month : 0, 1))
      const end = filters.month
        ? new Date(Date.UTC(year, month + 1, 1))
        : new Date(Date.UTC(year + 1, 0, 1))
      where.reference_month = { gte: start, lt: end }
    }

    const commissions = await prisma.commission.findMany({ where, select: { commission_value: true, status: true } })

    const totalValue = commissions.reduce((a, c) => a + Number(c.commission_value), 0)
    const totalPending = commissions.filter(c => c.status === 'PENDING').reduce((a, c) => a + Number(c.commission_value), 0)
    const totalConfirmed = commissions.filter(c => c.status === 'CONFIRMED').reduce((a, c) => a + Number(c.commission_value), 0)
    const totalPaid = commissions.filter(c => c.status === 'PAID').reduce((a, c) => a + Number(c.commission_value), 0)

    return { totalValue, totalPending, totalConfirmed, totalPaid, count: commissions.length }
  }
}
