import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { RegisterUserUseCase } from '../auth/register-user-use-case'

export function makeRegisterUser() {
  const userRepository = new PrismaUserRepository()
  const registerUserUseCase = new RegisterUserUseCase(userRepository)
  return registerUserUseCase
}
