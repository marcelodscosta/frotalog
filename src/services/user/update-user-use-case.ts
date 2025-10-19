import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface UpdateUserRequest {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: 'ADMIN' | 'EMPLOYEE'
  avatar?: string
}

interface UpdateUserResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(data.id)

    if (!user) {
      throw new UserNotFoundError()
    }

    // Se está tentando alterar o email, verificar se já existe
    if (data.email && data.email !== user.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(data.email)
      if (userWithSameEmail) {
        throw new UserAlreadyExistsError()
      }
    }

    const updatedUser = await this.userRepository.updateUser(data.id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      avatar: data.avatar,
    })

    return { user: updatedUser }
  }
}
