import { Prisma, User } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IUserRepository } from '../interfaces/IUserRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaUserRepository implements IUserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({ data })
    return user
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const updateUser = await prisma.user.update({
      where: { id },
      data,
    })
    return updateUser
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  }

  async findAll(page: number): Promise<PaginatedResult<User>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where: { is_Active: true },
        skip,
        take: PAGE_SIZE,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({
        where: { is_Active: true },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: users,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByRole(role: Prisma.Role, page: number): Promise<PaginatedResult<User>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where: { 
          is_Active: true,
          role 
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({
        where: { 
          is_Active: true,
          role 
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: users,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async searchByName(name: string, page: number): Promise<PaginatedResult<User>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          is_Active: true,
          name: { 
            contains: name, 
            mode: 'insensitive' 
          },
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({
        where: {
          is_Active: true,
          name: { 
            contains: name, 
            mode: 'insensitive' 
          },
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: users,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { is_Active: false },
    })
    return user
  }

  async activateUser(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { is_Active: true },
    })
    return user
  }
}
