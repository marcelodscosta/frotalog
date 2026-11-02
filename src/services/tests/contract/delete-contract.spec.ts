import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteContractUseCase } from '../../contract/delete-contract-use-case'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { ContractNotFoundError } from '../../errors/contract-not-fount-error'
import { AppError } from '../../errors/app-error'
import { prisma } from '../../../lib/prisma'

vi.mock('../../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(async (callback) => callback(prisma)),
    assetMovement: { count: vi.fn() },
    measurementBulletin: { count: vi.fn() },
    invoice: { count: vi.fn() },
    commission: { count: vi.fn() },
    commercialProposal: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    contract: { update: vi.fn() },
  },
}))

let contractRepository: InMemoryContractRepository
let sut: DeleteContractUseCase

describe('Delete Contract', () => {
  beforeEach(() => {
    contractRepository = new InMemoryContractRepository()
    sut = new DeleteContractUseCase(contractRepository)

    vi.clearAllMocks()
    vi.spyOn(prisma.assetMovement, 'count').mockResolvedValue(0)
    vi.spyOn(prisma.measurementBulletin, 'count').mockResolvedValue(0)
    vi.spyOn(prisma.invoice, 'count').mockResolvedValue(0)
    vi.spyOn(prisma.commission, 'count').mockResolvedValue(0)
    vi.spyOn(prisma.commercialProposal, 'findFirst').mockResolvedValue(null)
    vi.spyOn(prisma.contract, 'update').mockImplementation((async (args: any) => ({
      id: args.where.id,
      is_Active: false,
    })) as any)
  })

  it('should soft delete a contract successfully', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-001',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })

    const result = await sut.execute({ id: created.id })

    expect(result.contract).toBeDefined()
    expect(result.contract.id).toBe(created.id)
    expect(prisma.contract.update).toHaveBeenCalledWith({
      where: { id: created.id },
      data: { is_Active: false },
    })
  })

  it('should unlink the origin proposal when it has no financial data', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-002',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })
    vi.spyOn(prisma.commercialProposal, 'findFirst').mockResolvedValue({
      id: 'proposal-01',
    } as any)

    await sut.execute({ id: created.id })

    expect(prisma.commercialProposal.update).toHaveBeenCalledWith({
      where: { id: 'proposal-01' },
      data: { contractId: null, status: 'APPROVED' },
    })
  })

  it('should block deletion when the contract has linked financial records', async () => {
    const created = await contractRepository.create({
      contract_number: 'CT-003',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
    })
    vi.spyOn(prisma.assetMovement, 'count').mockResolvedValue(2)

    await expect(sut.execute({ id: created.id })).rejects.toBeInstanceOf(
      AppError,
    )
    expect(prisma.contract.update).not.toHaveBeenCalled()
  })

  it('should throw error when contract does not exist', async () => {
    await expect(
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ContractNotFoundError)
  })
})
