import { describe, it, expect, beforeEach } from 'vitest'
import { IAssetCategoryRepository } from '../../../repositories/interfaces/IAssetCategoryRepository'
import { FindAllAssetCategortUseCase } from '../../asset-category/find-all-asset-category-use-case'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'

describe('Find Asset Category', () => {
  let assetCategoryRepository: IAssetCategoryRepository
  let sut: FindAllAssetCategortUseCase

  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new FindAllAssetCategortUseCase(assetCategoryRepository)
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
    const assetCategories = await sut.execute({ page: 1 })
    expect(assetCategories.assetCategories).toHaveLength(3)
    expect(Array.isArray(assetCategories.assetCategories)).toBe(true)
  })
})
