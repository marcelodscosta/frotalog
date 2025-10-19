import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetUserByIdRequest {
  id: string
}

interface GetUserByIdResponse {
  user: User
}

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ id }: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return { user }
  }
}
