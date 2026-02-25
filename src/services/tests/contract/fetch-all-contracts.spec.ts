import { describe, it, expect, beforeEach } from 'vitest'
import { FetchAllContractsUseCase } from '../../contract/fetch-all-contracts-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'

let contractRepository: InMemoryContractRepository
let sut: FetchAllContractsUseCase

describe('Fetch All Contracts', () => {
  beforeEach(() => {
    contractRepository = new InMemoryContractRepository()
    sut = new FetchAllContractsUseCase(contractRepository)
  })

  it('should return paginated contracts', async () => {
    for (let i = 0; i < 25; i++) {
      await contractRepository.create({
        contract_number: `CT-${String(i).padStart(3, '0')}`,
        clientId: 'client-01',
        start_date: new Date('2026-01-01'),
      })
    }

    const result = await sut.execute({ page: 1 })

    expect(result.contracts.items).toHaveLength(20)
    expect(result.contracts.totalItems).toBe(25)
    expect(result.contracts.totalPages).toBe(2)
    expect(result.contracts.currentPage).toBe(1)
  })

  it('should return second page of contracts', async () => {
    for (let i = 0; i < 25; i++) {
      await contractRepository.create({
        contract_number: `CT-${String(i).padStart(3, '0')}`,
        clientId: 'client-01',
        start_date: new Date('2026-01-01'),
      })
    }

    const result = await sut.execute({ page: 2 })

    expect(result.contracts.items).toHaveLength(5)
    expect(result.contracts.currentPage).toBe(2)
  })

  it('should return empty when no contracts exist', async () => {
    const result = await sut.execute({ page: 1 })

    expect(result.contracts.items).toHaveLength(0)
    expect(result.contracts.totalItems).toBe(0)
  })
})
