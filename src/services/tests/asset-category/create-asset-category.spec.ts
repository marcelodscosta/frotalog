import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'
import { CreateAssetsCategoryUseCase } from '../../asset-category/create-asset-category-use-case'

let assetCategoryRepository: InMemoryAssetCategoryRepository
let sut: CreateAssetsCategoryUseCase

describe('Create AssetCategory', () => {
  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new CreateAssetsCategoryUseCase(assetCategoryRepository)
  })

  it('Should to create AssetCategory', async () => {
    const { assetCategory } = await sut.execute({
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })
    expect(assetCategory.id).toEqual(expect.any(String))
  })
})
