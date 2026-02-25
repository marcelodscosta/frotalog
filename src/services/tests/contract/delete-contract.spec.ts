import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteContractUseCase } from '../../contract/delete-contract-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { ContractNotFoundError } from '../../errors/contract-not-fount-error'

let contractRepository: InMemoryContractRepository
let sut: DeleteContractUseCase

describe('Delete Contract', () => {
  beforeEach(() => {
    contractRepository = new InMemoryContractRepository()
    sut = new DeleteContractUseCase(contractRepository)
  })

  it('should delete a contract successfully', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    const result = await sut.execute({ id: created.id })

    expect(result.contract).toBeDefined()
    expect(result.contract.id).toBe(created.id)
  })

  it('should throw error when contract does not exist', async () => {
    await expect(
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ContractNotFoundError)
  })
})
