import { beforeAll, describe, expect, it } from 'vitest'
import { InMemoryAssetCategoryRepository } from '../../repositories/in-memory/in-memory-asset-category-repository'
import { CreateAssetsCategoryUseCase } from '../create-asset-category'

let assetCategoryRepository: InMemoryAssetCategoryRepository
let sut: CreateAssetsCategoryUseCase

describe('Create AssetCategory', () => {
  beforeAll(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new CreateAssetsCategoryUseCase(assetCategoryRepository)
  })

  it('Should to create AssetCategory', async () => {
    const { assetCategory } = await sut.execute({
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })
    console.log(assetCategory)
    expect(assetCategory.id).toEqual(expect.any(String))
  })
})
