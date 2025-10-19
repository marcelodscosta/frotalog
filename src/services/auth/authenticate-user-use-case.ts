import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { AppError } from '../errors/app-error'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../../env'

interface AuthenticateUserRequest {
  email: string
  password: string
}

interface AuthenticateUserResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  token: string
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (!user.is_Active) {
      throw new AppError('User account is deactivated', 401)
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401)
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        sub: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret',
      { 
        expiresIn: '7d' 
      }
    )

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }
  }
}
