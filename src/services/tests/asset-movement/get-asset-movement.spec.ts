import { describe, it, expect, beforeEach } from 'vitest'
import { GetAssetMovementUseCase } from '../../asset-moviment/get-asset-movement-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { AssetMovimentNotFoundError } from '../../errors/asset-moviment-not-found-error'

let assetMovementRepository: InMemoryAssetMovementRepository
let sut: GetAssetMovementUseCase

describe('Get Asset Movement', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    sut = new GetAssetMovementUseCase(assetMovementRepository)
  })

  it('should return an asset movement by id', async () => {
    const created = await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-01',
      rental_value: 5000,
      billing_cycle: 'MONTHLY',
    })

    const result = await sut.execute({ id: created.id })

    expect(result.assetMovement).toBeDefined()
    expect(result.assetMovement.id).toBe(created.id)
    expect(result.assetMovement.contractId).toBe('contract-01')
    expect(result.assetMovement.assetId).toBe('asset-01')
  })

  it('should throw error when asset movement is not found', async () => {
    await expect(
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(AssetMovimentNotFoundError)
  })
})
