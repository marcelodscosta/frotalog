import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryAssetCategoryRepository } from '../../../repositories/in-memory/in-memory-asset-category-repository'
import { UpdateAssetCategoryUseCase } from '../../asset-category/update-asset-category-use-case'
import { AssetCategoryNotFoundError } from '../../errors/asset-category-not-found-error'

describe('InMemoryAssetCategoryRepository', async () => {
  let assetCategoryRepository: InMemoryAssetCategoryRepository
  let sut: UpdateAssetCategoryUseCase

  beforeEach(() => {
    assetCategoryRepository = new InMemoryAssetCategoryRepository()
    sut = new UpdateAssetCategoryUseCase(assetCategoryRepository)
  })

  it('should update an existing asset category', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao-1',
      name: 'Caminhão Munck',
      description: 'Descrição 1',
      type: 'VEHICLE',
      updated_at: new Date(),
    })

    await assetCategoryRepository.create({
      id: 'caminhao-2',
      name: 'Caminhão Comboio',
      description: 'Descrição 2',
      type: 'VEHICLE',
      updated_at: new Date(),
    })
    const updateData = {
      name: 'Caminhão Sugador',
      description: 'Sugar degetos',
      updated_at: new Date(),
    }

    const { assetCategory } = await sut.execute({
      id: 'caminhao-2',
      data: updateData,
    })

    expect(assetCategory.name).toEqual('Caminhão Sugador')
  })

  it('should display an error when updating a non-existent category', async () => {
    await assetCategoryRepository.create({
      id: 'caminhao-1',
      name: 'Caminhão Munck',
      description: 'Descrição 1',
      type: 'VEHICLE',
      updated_at: new Date(),
    })

    await assetCategoryRepository.create({
      id: 'caminhao-2',
      name: 'Caminhão Comboio',
      description: 'Descrição 2',
      type: 'VEHICLE',
      updated_at: new Date(),
    })
    const updateData = {
      name: 'Caminhão Sugador',
      description: 'Sugar degetos',
      updated_at: new Date(),
    }

    await expect(
      sut.execute({
        id: '123',
        data: updateData,
      }),
    ).rejects.toBeInstanceOf(AssetCategoryNotFoundError)
  })
})
