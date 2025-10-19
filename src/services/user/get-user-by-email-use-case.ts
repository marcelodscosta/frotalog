import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetUserByEmailRequest {
  email: string
}

interface GetUserByEmailResponse {
  user: User
}

export class GetUserByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email }: GetUserByEmailRequest): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    return { user }
  }
}
