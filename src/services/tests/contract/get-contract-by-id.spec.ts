import { describe, it, expect, beforeEach } from 'vitest'
import { GetContractByIdUseCase } from '../../contract/get-contract-by-id-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { ContractNotFoundError } from '../../errors/contract-not-fount-error'

let contractRepository: InMemoryContractRepository
let sut: GetContractByIdUseCase

describe('Get Contract by ID', () => {
  beforeEach(() => {
    contractRepository = new InMemoryContractRepository()
    sut = new GetContractByIdUseCase(contractRepository)
  })

  it('should return a contract by id', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    const result = await sut.execute({ id: created.id })

    expect(result.contract).toBeDefined()
    expect(result.contract.id).toBe(created.id)
    expect(result.contract.contract_number).toBe('CT-001')
  })

  it('should throw error when contract is not found', async () => {
    await expect(
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ContractNotFoundError)
  })
})
