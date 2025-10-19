import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FindAllUserRequest {
  page: number
}

interface FindAllUserResponse {
  users: PaginatedResult<User>
}

export class FindAllUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ page }: FindAllUserRequest): Promise<FindAllUserResponse> {
    const users = await this.userRepository.findAll(page)
    return { users }
  }
}
