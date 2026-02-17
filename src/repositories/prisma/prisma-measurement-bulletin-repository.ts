import {
  MeasurementBulletin,
  Prisma,
  MeasurementBulletinStatus,
} from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IMeasurementBulletinRepository } from '../interfaces/IMeasurementBulletinRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaMeasurementBulletinRepository
  implements IMeasurementBulletinRepository
{
  private readonly PAGE_SIZE = 20

  async create(
    data: Prisma.MeasurementBulletinUncheckedCreateInput,
  ): Promise<MeasurementBulletin> {
    return prisma.measurementBulletin.create({ data })
  }

  async findById(id: string): Promise<MeasurementBulletin | null> {
    return prisma.measurementBulletin.findUnique({ where: { id } })
  }

  async findByIdWithDetails(
    id: string,
  ): Promise<MeasurementBulletin | null> {
    return prisma.measurementBulletin.findUnique({
      where: { id },
      include: {
        contract: { include: { client: true } },
        assetMovement: { include: { asset: true } },
        invoice: true,
        expenses: { orderBy: { created_at: 'asc' } },
      },
    })
  }

  async findAll(
    page: number,
  ): Promise<PaginatedResult<MeasurementBulletin>> {
    const skip = (page - 1) * this.PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.measurementBulletin.findMany({
        where: { is_active: true },
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          contract: { include: { client: true } },
          assetMovement: { include: { asset: true } },
          invoice: true,
          expenses: { orderBy: { created_at: 'asc' } },
        },
      }),
      prisma.measurementBulletin.count({ where: { is_active: true } }),
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
    status?: MeasurementBulletinStatus
    contractId?: string
    assetId?: string
  }): Promise<PaginatedResult<MeasurementBulletin>> {
    const skip = (page - 1) * this.PAGE_SIZE
    const where: Prisma.MeasurementBulletinWhereInput = {
      is_active: true,
      ...(status && { status }),
      ...(contractId && { contractId }),
      ...(assetId && {
        assetMovement: {
          assetId,
        },
      }),
    }

    const [items, totalItems] = await prisma.$transaction([
      prisma.measurementBulletin.findMany({
        where,
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          contract: { include: { client: true } },
          assetMovement: { include: { asset: true } },
          invoice: true,
          expenses: { orderBy: { created_at: 'asc' } },
        },
      }),
      prisma.measurementBulletin.count({ where }),
    ])

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages: Math.ceil(totalItems / this.PAGE_SIZE),
    }
  }

  async findByContractId(
    contractId: string,
    page: number,
  ): Promise<PaginatedResult<MeasurementBulletin>> {
    // Deprecated in favor of findMany
    return this.findMany({ page, contractId })
  }

  async update(
    id: string,
    data: Prisma.MeasurementBulletinUpdateInput,
  ): Promise<MeasurementBulletin> {
    return prisma.measurementBulletin.update({ where: { id }, data })
  }

  async delete(id: string): Promise<MeasurementBulletin> {
    return prisma.measurementBulletin.update({
      where: { id },
      data: { is_active: false },
    })
  }
}
