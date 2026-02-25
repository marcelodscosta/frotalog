import { describe, it, expect, beforeEach } from 'vitest'
import { FetchAssetMovementsByAssetUseCase } from '../../asset-moviment/fetch-asset-movements-by-asset-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'

let assetMovementRepository: InMemoryAssetMovementRepository
let sut: FetchAssetMovementsByAssetUseCase

describe('Fetch Asset Movements by Asset', () => {
  beforeEach(async () => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    sut = new FetchAssetMovementsByAssetUseCase(assetMovementRepository)

    await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-01',
      rental_value: 5000,
    })

    await assetMovementRepository.create({
      contractId: 'contract-02',
      assetId: 'asset-01',
      rental_value: 6000,
    })

    await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-02',
      rental_value: 3000,
    })
  })

  it('should return movements for a specific asset', async () => {
    const result = await sut.execute({
      assetId: 'asset-01',
      page: 1,
    })

    expect(result.assetMovements.items).toHaveLength(2)
    expect(result.assetMovements.totalItems).toBe(2)
    expect(
      result.assetMovements.items.every(
        (m) => m.assetId === 'asset-01',
      ),
    ).toBe(true)
  })

  it('should return empty when asset has no movements', async () => {
    const result = await sut.execute({
      assetId: 'asset-99',
      page: 1,
    })

    expect(result.assetMovements.items).toHaveLength(0)
    expect(result.assetMovements.totalItems).toBe(0)
  })
})
