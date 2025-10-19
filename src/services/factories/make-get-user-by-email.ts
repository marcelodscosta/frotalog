import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetUserByEmailUseCase } from '../user/get-user-by-email-use-case'

export function makeGetUserByEmail() {
  const userRepository = new PrismaUserRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
  return getUserByEmailUseCase
}
