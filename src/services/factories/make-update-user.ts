import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { UpdateUserUseCase } from '../user/update-user-use-case'

export function makeUpdateUser() {
  const userRepository = new PrismaUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(userRepository)
  return updateUserUseCase
}
