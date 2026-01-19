import { Prisma, ServiceCategory } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IServiceCategoryRepository } from '../interfaces/IServiceCategoryRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaServiceCategoryRepository
  implements IServiceCategoryRepository
{
  async create(
    data: Prisma.ServiceCategoryUncheckedCreateInput,
  ): Promise<ServiceCategory> {
    const serviceCategory = await prisma.serviceCategory.create({ data })
    return serviceCategory
  }

  async findById(id: string): Promise<ServiceCategory | null> {
    const serviceCategory = await prisma.serviceCategory.findUnique({
      where: { id },
    })
    return serviceCategory
  }

  async searchServiceCategory(
    query: string,
    page: number,
  ): Promise<PaginatedResult<ServiceCategory>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [serviceCategories, totalCount] = await prisma.$transaction([
      prisma.serviceCategory.findMany({
        where: {
          is_active: true,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        skip,
        take: PAGE_SIZE,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.serviceCategory.count({
        where: {
          is_active: true,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: serviceCategories,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async updateServiceCategory(
    id: string,
    data: Prisma.ServiceCategoryUpdateInput,
  ): Promise<ServiceCategory> {
    const updateServiceCategory = await prisma.serviceCategory.update({
      where: { id },
      data,
    })
    return updateServiceCategory
  }

  async updateServiceCategoryIsActive(
    id: string,
    is_active: boolean,
  ): Promise<ServiceCategory> {
    const serviceCategory = await prisma.serviceCategory.update({
      where: { id },
      data: { is_active },
    })
    return serviceCategory
  }

  async findAll(page: number): Promise<PaginatedResult<ServiceCategory>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [serviceCategories, totalCount] = await prisma.$transaction([
      prisma.serviceCategory.findMany({
        where: {
          is_active: true,
        },
        skip,
        take: PAGE_SIZE,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.serviceCategory.count({
        where: {
          is_active: true,
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: serviceCategories,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAllUnpaginated(): Promise<ServiceCategory[]> {
    return await prisma.serviceCategory.findMany({
      where: {
        is_active: true,
      },
      orderBy: { name: 'asc' },
    })
  }
}
