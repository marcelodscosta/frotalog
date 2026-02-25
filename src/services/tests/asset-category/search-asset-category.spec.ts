import { describe, it, beforeEach, expect } from 'vitest'
import { SearchAssetCategoryUseCase } from '../../asset-category/search-asset-category-use-case'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'

let assetCategoryRepository: InMemoryAssetCategoryRepository
let sut: SearchAssetCategoryUseCase

describe('Search AssetCategory', () => {
  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new SearchAssetCategoryUseCase(assetCategoryRepository)
  })

  it('should return items matching the query', async () => {
    for (let index = 0; index < 30; index++) {
      await assetCategoryRepository.create({
        name: `Caminhão Munck ${index}`,
        description: '',
        type: 'EQUIPMENT',
      })
    }
    const result = await sut.execute({ page: 1, query: 'Caminhão' })

    expect(result.assetCategories.length).toBe(20)
    expect(result.pageSize).toBe(20)
    expect(result.totalItems).toBe(30)
    expect(result.totalPages).toBe(2)
  })

  it('should return empty array if no items match', async () => {
    await assetCategoryRepository.create({
      name: 'Caminhão Guindaste',
      description: '',
      type: 'VEHICLE',
    })
    const result = await sut.execute({ page: 1, query: 'Não existe' })

    expect(result.assetCategories.length).toBe(0)
    expect(result.currentPage).toBe(1)
    expect(result.totalItems).toBe(0)
  })
})
