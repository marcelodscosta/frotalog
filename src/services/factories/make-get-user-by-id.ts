import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetUserByIdUseCase } from '../user/get-user-by-id-use-case'

export function makeGetUserById() {
  const userRepository = new PrismaUserRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
  return getUserByIdUseCase
}
