import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryUserRepository } from '../../../repositories/in-memory/in-memory-user-repository'
import { GetUserByIdUseCase } from '../../user/get-user-by-id-use-case'
import { UserNotFoundError } from '../../errors/user-not-found-error'

let userRepository: InMemoryUserRepository
let getUserByIdUseCase: GetUserByIdUseCase

describe('Get User By ID', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
  })

  it('Should get User by ID', async () => {
    const createdUser = await userRepository.create({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hashedpassword123',
    })

    const { user } = await getUserByIdUseCase.execute({
      id: createdUser.id,
    })

    expect(user.id).toBe(createdUser.id)
    expect(user.name).toBe('João Silva')
  })

  it('Should not get User if ID does not exist', async () => {
    await expect(
      getUserByIdUseCase.execute({
        id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
