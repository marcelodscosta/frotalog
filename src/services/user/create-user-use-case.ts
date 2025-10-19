import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface CreateUserRequest {
  name: string
  email: string
  phone?: string
  password_hash: string
  role?: 'ADMIN' | 'EMPLOYEE'
  avatar?: string
}

interface CreateUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserRequest): Promise<CreateUserResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password_hash: data.password_hash,
      role: data.role || 'EMPLOYEE',
      avatar: data.avatar,
    })

    return { user }
  }
}
