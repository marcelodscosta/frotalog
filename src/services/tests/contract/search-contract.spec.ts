import { describe, it, expect, beforeEach } from 'vitest'
import { SearchContractsUseCase } from '../../contract/search-contract-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { ContractNotFoundError } from '../../errors/contract-not-fount-error'

let contractRepository: InMemoryContractRepository
let sut: SearchContractsUseCase

describe('Search Contracts', () => {
  beforeEach(async () => {
    contractRepository = new InMemoryContractRepository()
    sut = new SearchContractsUseCase(contractRepository)

    await contractRepository.create({
      contract_number: 'CT-001',
      description: 'Locação de guindaste',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
      status: 'ACTIVE',
    })

    await contractRepository.create({
      contract_number: 'CT-002',
      description: 'Locação de caminhão',
      clientId: 'client-02',
      start_date: new Date('2026-02-01'),
      status: 'DRAFT',
    })
  })

  it('should find contracts by contract number', async () => {
    const result = await sut.execute({
      contract_number: 'CT-001',
      page: 1,
    })

    expect(result.contracts.items).toHaveLength(1)
    expect(result.contracts.items[0].contract_number).toBe('CT-001')
  })

  it('should find contracts by status', async () => {
    const result = await sut.execute({
      status: 'ACTIVE',
      page: 1,
    })

    expect(result.contracts.items).toHaveLength(1)
    expect(result.contracts.items[0].status).toBe('ACTIVE')
  })

  it('should throw error when no contracts match', async () => {
    await expect(
      sut.execute({
        contract_number: 'CT-999',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ContractNotFoundError)
  })
})
