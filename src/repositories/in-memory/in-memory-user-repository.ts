import { User, Prisma } from '../../generated/prisma'
import { IUserRepository } from '../interfaces/IUserRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      password_hash: data.password_hash,
      role: data.role || 'EMPLOYEE',
      avatar: data.avatar || null,
      created_at: new Date(),
      updated_at: new Date(),
      is_Active: true,
    }

    this.users.push(user)
    return user
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const user = this.users[userIndex]
    const updatedUser = {
      ...user,
      ...data,
      updated_at: new Date(),
    }

    this.users[userIndex] = updatedUser as User
    return updatedUser as User
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)
    return user || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)
    return user || null
  }

  async findAll(page: number): Promise<PaginatedResult<User>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const activeUsers = this.users.filter((user) => user.is_Active)
    const totalCount = activeUsers.length

    const users = activeUsers
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + PAGE_SIZE)

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

    const activeUsersByRole = this.users.filter(
      (user) => user.is_Active && user.role === role
    )
    const totalCount = activeUsersByRole.length

    const users = activeUsersByRole
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + PAGE_SIZE)

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

    const activeUsersByName = this.users.filter(
      (user) => 
        user.is_Active && 
        user.name.toLowerCase().includes(name.toLowerCase())
    )
    const totalCount = activeUsersByName.length

    const users = activeUsersByName
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + PAGE_SIZE)

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
    const userIndex = this.users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      is_Active: false,
      updated_at: new Date(),
    }

    return this.users[userIndex]
  }

  async activateUser(id: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      is_Active: true,
      updated_at: new Date(),
    }

    return this.users[userIndex]
  }
}
