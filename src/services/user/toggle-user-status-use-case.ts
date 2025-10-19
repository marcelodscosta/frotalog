import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface ToggleUserStatusRequest {
  id: string
  action: 'activate' | 'deactivate'
}

interface ToggleUserStatusResponse {
  user: User
}

export class ToggleUserStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ id, action }: ToggleUserStatusRequest): Promise<ToggleUserStatusResponse> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    const updatedUser = action === 'activate' 
      ? await this.userRepository.activateUser(id)
      : await this.userRepository.deactivateUser(id)

    return { user: updatedUser }
  }
}
