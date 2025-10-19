import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryUserRepository } from '../../../repositories/in-memory/in-memory-user-repository'
import { CreateUserUseCase } from '../../user/create-user-use-case'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'

let userRepository: InMemoryUserRepository
let createUserUseCase: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)
  })

  it('Should create User', async () => {
    const { user } = await createUserUseCase.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '11999999999',
      password_hash: 'hashedpassword123',
      role: 'EMPLOYEE',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toBe('João Silva')
    expect(user.email).toBe('joao@example.com')
    expect(user.role).toBe('EMPLOYEE')
  })

  it('Should not create User if email already exists', async () => {
    await createUserUseCase.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hashedpassword123',
    })

    await expect(
      createUserUseCase.execute({
        name: 'Maria Silva',
        email: 'joao@example.com',
        password_hash: 'hashedpassword456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('Should create User with default role EMPLOYEE', async () => {
    const { user } = await createUserUseCase.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hashedpassword123',
    })

    expect(user.role).toBe('EMPLOYEE')
  })
})
