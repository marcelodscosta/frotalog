import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryContractRepository } from '../../repositories/in-memory/in-memory-contract-repository'
import { GetContractFinancialSummaryUseCase } from './get-contract-financial-summary-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Prisma } from '../../generated/prisma'

let contractRepository: InMemoryContractRepository
let sut: GetContractFinancialSummaryUseCase

describe('Get Contract Financial Summary Use Case', () => {
  beforeEach(() => {
    contractRepository = new InMemoryContractRepository()
    sut = new GetContractFinancialSummaryUseCase(contractRepository)
  })

  it('should be able to get a contract financial summary', async () => {
    const contract = await contractRepository.create({
      contract_number: '12345',
      clientId: 'client-1',
      start_date: new Date(),
      total_value: new Prisma.Decimal('10000.00'),
    })

    contractRepository.financialSummaryMockData = {
      totalMaintenanceCost: 2000,
      totalOtherExpenses: 3000,
    }

    const { financialSummary } = await sut.execute({
      contractId: contract.id,
    })

    expect(financialSummary).toEqual(expect.objectContaining({
      totalContractValue: 10000,
      totalMaintenanceCost: 2000,
      totalOtherExpenses: 3000,
      balance: 5000, // 10000 - 2000 - 3000
    }))
  })

  it('should not be able to get financial summary from a non-existing contract', async () => {
    await expect(() =>
      sut.execute({ contractId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
