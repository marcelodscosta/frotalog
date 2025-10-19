import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'

import { CreateAssetUseCase } from '../../asset/create-asset-use-case'
import { AssetCategoryNotFoundError } from '../../errors/asset-category-not-found-error'

let assetCategoryRepository: InMemoryAssetCategoryRepository
let assetRepository: InMemoryAssetRepository
let createAssetUseCase: CreateAssetUseCase

describe('Create Asset', () => {
  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    assetRepository = new InMemoryAssetRepository()

    createAssetUseCase = new CreateAssetUseCase(
      assetRepository,
      assetCategoryRepository,
    )
  })
  it('Should create Asset', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao-01',
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })

    const { asset } = await createAssetUseCase.execute({
      assetCategoryId: 'caminhao-01',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })
    expect(asset.assetCategoryId).toEqual(expect.any(String))
  })
  it('Should not create an Asset if asset category does not exist', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao-01',
      name: 'Caminhão Munck',
      description: '',
      type: 'VEHICLE',
    })

    await expect(
      createAssetUseCase.execute({
        assetCategoryId: 'caminhao-02',
        brand: 'FORD',
        model: '136-05',
        plate: 'PIC5864',
        year: 1995,
      }),
    ).rejects.toBeInstanceOf(AssetCategoryNotFoundError)
  })
})
