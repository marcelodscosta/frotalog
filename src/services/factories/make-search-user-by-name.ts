import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { SearchUserByNameUseCase } from '../user/search-user-by-name-use-case'

export function makeSearchUserByName() {
  const userRepository = new PrismaUserRepository()
  const searchUserByNameUseCase = new SearchUserByNameUseCase(userRepository)
  return searchUserByNameUseCase
}
