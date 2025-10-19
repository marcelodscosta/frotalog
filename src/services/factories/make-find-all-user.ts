import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { FindAllUserUseCase } from '../user/find-all-user-use-case'

export function makeFindAllUser() {
  const userRepository = new PrismaUserRepository()
  const findAllUserUseCase = new FindAllUserUseCase(userRepository)
  return findAllUserUseCase
}
