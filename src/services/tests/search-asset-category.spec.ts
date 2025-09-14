import { describe, it, beforeEach, expect } from 'vitest'
import { SearchAssetCategoryUseCase } from '../asset-category/search-asset-category-use-case'
import { InMemoryAssetCategoryRepository } from '../../repositories/in-memory/in-memory-asset-category-repository'

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
    expect(result.assetCategory.length).toBe(20)
  })
  it('shold return empty array if no items match', async () => {
    await assetCategoryRepository.create({
      name: 'Caminhão Guindaste',
      description: '',
      type: 'VEHICLE',
    })
    const result = await sut.execute({ page: 1, query: 'Não existe' })
    expect(result.assetCategory.length).toBe(0)
  })
})
