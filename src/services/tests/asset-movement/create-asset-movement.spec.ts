import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAssetMovementUseCase } from '../../asset-moviment/create-asset-moviment-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'

let assetMovementRepository: InMemoryAssetMovementRepository
let assetRepository: InMemoryAssetRepository
let contractRepository: InMemoryContractRepository
let sut: CreateAssetMovementUseCase

async function createPrerequisites(status: 'ACTIVE' | 'DRAFT' = 'ACTIVE') {
  const asset = await assetRepository.create({
    brand: 'Marca Teste',
    model: 'Modelo Teste',
  })
  const contract = await contractRepository.create({
    contract_number: `CT-${Math.random().toString(36).slice(2)}`,
    clientId: 'client-01',
    start_date: new Date('2026-01-01'),
    status,
  })

  return { asset, contract }
}

describe('Create Asset Movement', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    assetRepository = new InMemoryAssetRepository()
    contractRepository = new InMemoryContractRepository()
    sut = new CreateAssetMovementUseCase(
      assetMovementRepository,
      assetRepository,
      contractRepository,
    )
  })

  it('should finish the contract when the created movement is already demobilized', async () => {
    const { asset, contract } = await createPrerequisites('ACTIVE')

    await sut.execute({
      contractId: contract.id,
      assetId: asset.id,
      rental_value: 5000,
      mobilization_date: new Date('2026-09-01T12:00:00Z'),
      demobilization_date: new Date('2026-10-30T12:00:00Z'),
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('FINISHED')
  })

  it('should keep the contract active when the created movement is not demobilized', async () => {
    const { asset, contract } = await createPrerequisites('ACTIVE')

    await sut.execute({
      contractId: contract.id,
      assetId: asset.id,
      rental_value: 5000,
      mobilization_date: new Date('2026-09-01T12:00:00Z'),
    })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('ACTIVE')
  })
})
