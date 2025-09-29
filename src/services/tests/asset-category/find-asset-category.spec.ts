import { describe, it, expect, beforeEach } from 'vitest'
import { IAssetCategoryRepository } from '../../../repositories/interfaces/IAssetCategoryRepository'
import { FindAllAssetCategoryUseCase } from '../../asset-category/find-all-asset-category-use-case'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'

describe('Find Asset Category', () => {
  let assetCategoryRepository: IAssetCategoryRepository
  let sut: FindAllAssetCategoryUseCase

  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new FindAllAssetCategoryUseCase(assetCategoryRepository)
  })

  it('Find All AssetCategory', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao-01',
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })
    await assetCategoryRepository.create({
      id: 'caminhao-02',
      name: 'Caminhão Escavadeira',
      description: '',
      type: 'VEHICLE',
    })
    await assetCategoryRepository.create({
      id: 'caminhao-03',
      name: 'Caminhão Comboio',
      description: '',
      type: 'VEHICLE',
    })

    const result = await sut.execute({ page: 1 })

    expect(result.assetCategories).toHaveLength(3)
    expect(Array.isArray(result.assetCategories)).toBe(true)
    expect(result.currentPage).toBe(1)
    expect(result.pageSize).toBeGreaterThan(0)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
  })
})
