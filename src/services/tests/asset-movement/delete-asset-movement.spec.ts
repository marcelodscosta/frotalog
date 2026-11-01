import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteAssetMovementUseCase } from '../../asset-moviment/delete-asset-movement-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { AssetMovimentNotFoundError } from '../../errors/asset-moviment-not-found-error'

let assetMovementRepository: InMemoryAssetMovementRepository
let contractRepository: InMemoryContractRepository
let sut: DeleteAssetMovementUseCase

describe('Delete Asset Movement', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    contractRepository = new InMemoryContractRepository()
    sut = new DeleteAssetMovementUseCase(
      assetMovementRepository,
      contractRepository,
    )
  })

  it('should delete an asset movement successfully', async () => {
    const created = await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-01',
      rental_value: 5000,
    })

    const result = await sut.execute({ id: created.id })

    expect(result.assetMovement).toBeDefined()
    expect(result.assetMovement.id).toBe(created.id)
  })

  it('should throw error when asset movement does not exist', async () => {
    await expect(
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(AssetMovimentNotFoundError)
  })

  it('should finish the contract when deleting its last movement still open', async () => {
    const contract = await contractRepository.create({
      contract_number: 'CT-DELETE',
      clientId: 'client-01',
      start_date: new Date('2026-01-01'),
      status: 'ACTIVE',
    })
    await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-01',
      rental_value: 5000,
      demobilization_date: new Date('2026-10-01T12:00:00Z'),
    })
    const openMovement = await assetMovementRepository.create({
      contractId: contract.id,
      assetId: 'asset-02',
      rental_value: 5000,
    })

    await sut.execute({ id: openMovement.id })

    const updatedContract = await contractRepository.findById(contract.id)
    expect(updatedContract?.status).toBe('FINISHED')
  })
})
