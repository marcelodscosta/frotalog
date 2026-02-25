import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteAssetMovementUseCase } from '../../asset-moviment/delete-asset-movement-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { AssetMovimentNotFoundError } from '../../errors/asset-moviment-not-found-error'

let assetMovementRepository: InMemoryAssetMovementRepository
let sut: DeleteAssetMovementUseCase

describe('Delete Asset Movement', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    sut = new DeleteAssetMovementUseCase(assetMovementRepository)
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
})
