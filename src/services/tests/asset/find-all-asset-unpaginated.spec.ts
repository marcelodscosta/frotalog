import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { FindAllAssetUnpaginatedUseCase } from '../../asset/find-all-asset-unpaginated-use-case'

let assetRepository: InMemoryAssetRepository
let sut: FindAllAssetUnpaginatedUseCase

describe('Find All Assets Unpaginated Use Case', () => {
  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    sut = new FindAllAssetUnpaginatedUseCase(assetRepository)
  })

  it('Should return all active assets', async () => {
    // Active asset
    await assetRepository.create({
      id: 'active-1',
      assetCategoryId: 'cat-1',
      brand: 'VOLVO',
      model: 'FH 540',
      plate: 'ABC1234',
      year: 2020,
      is_Active: true,
    })

    // Another active asset
    await assetRepository.create({
      id: 'active-2',
      assetCategoryId: 'cat-2',
      brand: 'SCANIA',
      model: 'R450',
      plate: 'DEF5678',
      year: 2021,
      is_Active: true,
    })

    // Inactive asset
    await assetRepository.create({
      id: 'inactive-1',
      assetCategoryId: 'cat-1',
      brand: 'MERCEDES',
      model: 'ACTROS',
      plate: 'GHI9012',
      year: 2019,
      is_Active: false,
    })

    const { assets } = await sut.execute()
    
    expect(assets).toHaveLength(2)
    expect(assets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ brand: 'VOLVO' }),
        expect.objectContaining({ brand: 'SCANIA' }),
      ])
    )
    // Ensure inactive is not present
    expect(assets).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ brand: 'MERCEDES' }),
      ])
    )
  })
})
