import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetUserByRoleUseCase } from '../user/get-user-by-role-use-case'

export function makeGetUserByRole() {
  const userRepository = new PrismaUserRepository()
  const getUserByRoleUseCase = new GetUserByRoleUseCase(userRepository)
  return getUserByRoleUseCase
}
