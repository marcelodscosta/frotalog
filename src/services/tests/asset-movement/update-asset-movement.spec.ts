import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateAssetMovementUseCase } from '../../asset-moviment/update-asset-movement-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { AssetMovimentNotFoundError } from '../../errors/asset-moviment-not-found-error'

let assetMovementRepository: InMemoryAssetMovementRepository
let sut: UpdateAssetMovementUseCase

describe('Update Asset Movement', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    sut = new UpdateAssetMovementUseCase(assetMovementRepository)
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
})
