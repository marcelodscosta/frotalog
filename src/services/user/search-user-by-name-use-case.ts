import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface SearchUserByNameRequest {
  name: string
  page: number
}

interface SearchUserByNameResponse {
  users: PaginatedResult<User>
}

export class SearchUserByNameUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, page }: SearchUserByNameRequest): Promise<SearchUserByNameResponse> {
    const users = await this.userRepository.searchByName(name, page)
    return { users }
  }
}
