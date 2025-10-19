import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import bcrypt from 'bcryptjs'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'ADMIN' | 'EMPLOYEE'
}

interface RegisterUserResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(data.password, 10)

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password_hash,
      role: data.role || 'EMPLOYEE',
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}
