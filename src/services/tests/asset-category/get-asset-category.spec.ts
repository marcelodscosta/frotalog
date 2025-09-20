import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'
import { GetAssetCategoryByIdUseCase } from '../../asset-category/get-asset-category-by-id-use-case'

let assetCategoryRepository: InMemoryAssetCategoryRepository
let sut: GetAssetCategoryByIdUseCase

describe('Find AssetCategory', () => {
  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new GetAssetCategoryByIdUseCase(assetCategoryRepository)
  })
  it('Should to find AssetCategory by ID', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao01',
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })
    await assetCategoryRepository.create({
      id: 'caminhao02',
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })

    const result = await sut.execute({ id: 'caminhao02' })
    expect(result.assetCategory?.id).toBe('caminhao02')
  })
  it('Should return null when AssetCategory is not found', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao01',
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })
    const result = await sut.execute({ id: 'id-inexistente' })
    expect(result.assetCategory).toBeNull()
  })
})
