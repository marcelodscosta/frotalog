import { describe, beforeEach, it, expect } from 'vitest'
import { IAssetRepository } from '../../../repositories/interfaces/IAssetRepository'
import { FindAllAssetUseCase } from '../../asset/find-all-asset-use-case'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'

describe('Find Asset (s)', () => {
  let assetRepository: IAssetRepository
  let sut: FindAllAssetUseCase

  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    sut = new FindAllAssetUseCase(assetRepository)
  })

  it('Find All Assets', async () => {
    await assetRepository.create({
      assetCategoryId: 'caminhao-01',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    await assetRepository.create({
      assetCategoryId: 'caminhao-02',
      brand: 'VW',
      model: '4897',
      plate: 'OUY0597',
      year: 2001,
    })
    await assetRepository.create({
      assetCategoryId: 'caminhao-03',
      brand: 'VW',
      model: '48972',
      plate: 'OVC8797',
      year: 2018,
    })

    const result = await sut.execute({ page: 1 })

    expect(result.assets).toHaveLength(3)
    expect(result.currentPage).toBe(1)
    expect(result.pageSize).toBeGreaterThan(0)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
  })
})
