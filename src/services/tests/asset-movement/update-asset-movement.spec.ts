import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateAssetMovementUseCase } from '../../asset-moviment/update-asset-movement-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { AssetMovimentNotFoundError } from '../../errors/asset-moviment-not-found-error'

let assetMovementRepository: InMemoryAssetMovementRepository
let contractRepository: InMemoryContractRepository
let sut: UpdateAssetMovementUseCase

async function createContract(status: 'ACTIVE' | 'DRAFT' = 'ACTIVE') {
  return contractRepository.create({
    contract_number: `CT-${Math.random().toString(36).slice(2)}`,
    clientId: 'client-01',
    start_date: new Date('2026-01-01'),
    status,
  })
}

describe('Update Asset Movement', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    contractRepository = new InMemoryContractRepository()
    sut = new UpdateAssetMovementUseCase(
      assetMovementRepository,
      contractRepository,
    )
  })

  it('should update an asset movement successfully', async () => {
    const created = await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-01',
      rental_value: 5000,
      billing_cycle: 'MONTHLY',
    })

    const result = await sut.execute({
      id: created.id,
      data: {
        operator_name: 'Carlos Silva',
        notes: 'Nota atualizada',
      },
    })

    expect(result.assetMovement.operator_name).toBe('Carlos Silva')
    expect(result.assetMovement.notes).toBe('Nota atualizada')
  })

  it('should throw error when asset movement does not exist', async () => {
    await expect(
      sut.execute({
        id: 'non-existent-id',
        data: { operator_name: 'Test' },
      }),
    ).rejects.toBeInstanceOf(AssetMovimentNotFoundError)
  })

  it('should finish the contract when its last active movement is demobilized', async () => {
    const contract = await createContract('ACTIVE')
    const movement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-01',
      rental_value: 5000,
    })

    await sut.execute({
      id: movement.id,
      data: { demobilization_date: new Date('2026-10-30T12:00:00Z') },
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('FINISHED')
  })

  it('should keep the contract active while another movement is not demobilized', async () => {
    const contract = await createContract('ACTIVE')
    const firstMovement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-01',
      rental_value: 5000,
    })
    await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-02',
      rental_value: 5000,
    })

    await sut.execute({
      id: firstMovement.id,
      data: { demobilization_date: new Date('2026-10-30T12:00:00Z') },
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('ACTIVE')
  })

  it('should keep the contract active when demobilization is scheduled for the future', async () => {
    const contract = await createContract('ACTIVE')
    const movement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-01',
      rental_value: 5000,
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)

    await sut.execute({
      id: movement.id,
      data: { demobilization_date: futureDate },
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('ACTIVE')
  })

  it('should not change a contract that is not active', async () => {
    const contract = await createContract('DRAFT')
    const movement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-01',
      rental_value: 5000,
    })

    await sut.execute({
      id: movement.id,
      data: { demobilization_date: new Date('2026-10-30T12:00:00Z') },
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('DRAFT')
  })

  it('should ignore soft-deleted movements when checking demobilization', async () => {
    const contract = await createContract('ACTIVE')
    const firstMovement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-01',
      rental_value: 5000,
    })
    const secondMovement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-02',
      rental_value: 5000,
    })
    await assetMovementRepository.deleteAssetMovement(secondMovement.id)

    await sut.execute({
      id: firstMovement.id,
      data: { demobilization_date: new Date('2026-10-30T12:00:00Z') },
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('FINISHED')
  })
})
