import { describe, it, expect, beforeEach } from 'vitest'
import { FetchAssetMovementsByContractUseCase } from '../../asset-moviment/fetch-asset-movements-by-contract-use-case'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'

let assetMovementRepository: InMemoryAssetMovementRepository
let sut: FetchAssetMovementsByContractUseCase

describe('Fetch Asset Movements by Contract', () => {
  beforeEach(async () => {
    assetMovementRepository = new InMemoryAssetMovementRepository()
    sut = new FetchAssetMovementsByContractUseCase(assetMovementRepository)

    await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-01',
      rental_value: 5000,
    })

    await assetMovementRepository.create({
      contractId: 'contract-01',
      assetId: 'asset-02',
      rental_value: 3000,
    })

    await assetMovementRepository.create({
      contractId: 'contract-02',
      assetId: 'asset-03',
      rental_value: 7000,
    })
  })

  it('should return movements for a specific contract', async () => {
    const result = await sut.execute({
      contractId: 'contract-01',
      page: 1,
    })

    expect(result.assetMovements.items).toHaveLength(2)
    expect(result.assetMovements.totalItems).toBe(2)
    expect(
      result.assetMovements.items.every(
        (m) => m.contractId === 'contract-01',
      ),
    ).toBe(true)
  })

  it('should return empty when contract has no movements', async () => {
    const result = await sut.execute({
      contractId: 'contract-99',
      page: 1,
    })

    expect(result.assetMovements.items).toHaveLength(0)
    expect(result.assetMovements.totalItems).toBe(0)
  })
})
