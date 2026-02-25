import { describe, it, expect, beforeEach } from 'vitest'
import { GetContractByNumberUseCase } from '../../contract/get-contract-by-number'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { ContractNotFoundError } from '../../errors/contract-not-fount-error'

let contractRepository: InMemoryContractRepository
let sut: GetContractByNumberUseCase

describe('Get Contract by Number', () => {
  beforeEach(() => {
    contractRepository = new InMemoryContractRepository()
    sut = new GetContractByNumberUseCase(contractRepository)
  })

  it('should return a contract by number', async () => {
    await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    const result = await sut.execute({ contract_number: 'CT-001' })

    expect(result.contract).toBeDefined()
    expect(result.contract.contract_number).toBe('CT-001')
  })

  it('should throw error when contract number is not found', async () => {
    await expect(
      sut.execute({ contract_number: 'CT-999' }),
    ).rejects.toBeInstanceOf(ContractNotFoundError)
  })
})
