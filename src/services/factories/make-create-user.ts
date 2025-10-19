import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { CreateUserUseCase } from '../user/create-user-use-case'

export function makeCreateUser() {
  const userRepository = new PrismaUserRepository()
  const createUserUseCase = new CreateUserUseCase(userRepository)
  return createUserUseCase
}
