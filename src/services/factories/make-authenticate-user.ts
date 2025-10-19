import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { AuthenticateUserUseCase } from '../auth/authenticate-user-use-case'

export function makeAuthenticateUser() {
  const userRepository = new PrismaUserRepository()
  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository)
  return authenticateUserUseCase
}
