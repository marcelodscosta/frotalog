import { Prisma, Supplier } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { PaginatedResult } from '../interfaces/IPaginatedResult'
import { ISupplierRepository } from '../interfaces/ISupplierRepository'

export class PrismaSupplierRepository implements ISupplierRepository {
  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return await prisma.supplier.create({ data })
  }

  async findById(id: string): Promise<Supplier | null> {
    return await prisma.supplier.findFirst({
      where: {
        id,
      },
    })
  }

  async updateSupplier(
    id: string,
    data: Prisma.SupplierUpdateInput,
  ): Promise<Supplier> {
    const supplier = await prisma.supplier.update({
      where: {
        id,
      },
      data,
    })
    return supplier
  }

  async findByCompanyName(
    page: number,
    query: string,
  ): Promise<PaginatedResult<Supplier>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.supplier.findMany({
        where: {
          is_Active: true,
          company_name: { contains: query, mode: 'insensitive' },
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.supplier.count({
        where: {
          is_Active: true,
          company_name: { contains: query, mode: 'insensitive' },
        },
      }),
    ])
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findAll(page: number): Promise<PaginatedResult<Supplier>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [suppliers, totalCount] = await prisma.$transaction([
      prisma.supplier.findMany({
        where: { is_Active: true },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.supplier.count({
        where: { is_Active: true },
      }),
    ])
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: suppliers,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }
}
