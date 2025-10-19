import { User, Prisma } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>
  
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  
  findAll(page: number): Promise<PaginatedResult<User>>
  findByRole(role: Prisma.Role, page: number): Promise<PaginatedResult<User>>
  searchByName(name: string, page: number): Promise<PaginatedResult<User>>
  
  deactivateUser(id: string): Promise<User>
  activateUser(id: string): Promise<User>
}
