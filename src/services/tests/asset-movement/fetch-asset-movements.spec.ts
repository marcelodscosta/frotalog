import { describe, it, expect, beforeEach } from 'vitest'
import { FetchAssetMovementsUseCase } from '../../asset-moviment/fetch-asset-movements-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'

let assetMovementRepository: InMemoryAssetMovementRepository
let sut: FetchAssetMovementsUseCase

describe('Fetch Asset Movements', () => {
  beforeEach(() => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    sut = new FetchAssetMovementsUseCase(assetMovementRepository)
  })

  it('should return paginated asset movements', async () => {
    for (let i = 0; i < 25; i++) {
      await assetMovementRepository.create({
        contractId: 'contract-01',
        assetId: `asset-${String(i).padStart(2, '0')}`,
        rental_value: 5000,
        billing_cycle: 'MONTHLY',
      })
    }

    const result = await sut.execute({ page: 1 })

    expect(result.assetMovements.items).toHaveLength(20)
    expect(result.assetMovements.totalItems).toBe(25)
    expect(result.assetMovements.totalPages).toBe(2)
    expect(result.assetMovements.currentPage).toBe(1)
  })

  it('should return second page', async () => {
    for (let i = 0; i < 25; i++) {
      await assetMovementRepository.create({
        contractId: 'contract-01',
        assetId: `asset-${String(i).padStart(2, '0')}`,
        rental_value: 5000,
      })
    }

    const result = await sut.execute({ page: 2 })

    expect(result.assetMovements.items).toHaveLength(5)
    expect(result.assetMovements.currentPage).toBe(2)
  })

  it('should return empty when no movements exist', async () => {
    const result = await sut.execute({ page: 1 })

    expect(result.assetMovements.items).toHaveLength(0)
    expect(result.assetMovements.totalItems).toBe(0)
  })
})
