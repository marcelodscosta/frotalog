import { User, Prisma } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface GetUserByRoleRequest {
  role: Prisma.Role
  page: number
}

interface GetUserByRoleResponse {
  users: PaginatedResult<User>
}

export class GetUserByRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ role, page }: GetUserByRoleRequest): Promise<GetUserByRoleResponse> {
    const users = await this.userRepository.findByRole(role, page)
    return { users }
  }
}
