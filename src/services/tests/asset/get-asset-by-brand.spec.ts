import { describe, beforeEach, it, expect } from 'vitest'
import { IAssetRepository } from '../../../repositories/interfaces/IAssetRepository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { GetAssetByBrandUseCase } from '../../asset/get-asset-by-brand-use-case'

describe('Find Asset by brand', () => {
  let assetRepository: IAssetRepository
  let sut: GetAssetByBrandUseCase

  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    sut = new GetAssetByBrandUseCase(assetRepository)
  })

  it('Should to find Asset by brand', async () => {
    await assetRepository.create({
      id: 'asset-01',
      assetCategoryId: 'caminhao-01',
      brand: 'VW',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    await assetRepository.create({
      id: 'asset-02',
      assetCategoryId: 'caminhao-02',
      brand: 'VW',
      model: '4897',
      plate: 'OUY0597',
      year: 2001,
    })

    const result = await sut.execute({ page: 1, brand: 'VW' })

    expect(result.assets.length).toEqual(2)
    expect(result.currentPage).toBe(1)
    expect(result.pageSize).toBeGreaterThan(0)
    expect(result.totalItems).toBe(2)
    expect(result.totalPages).toBe(1)
  })

  it('Should return empty array when no assets found for brand', async () => {
    await assetRepository.create({
      id: 'asset-01',
      assetCategoryId: 'caminhao-01',
      brand: 'Ford',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    const result = await sut.execute({ page: 1, brand: 'VW' })

    expect(result.assets.length).toEqual(0)
    expect(result.assets).toEqual([])
    expect(result.currentPage).toBe(1)
    expect(result.totalItems).toBe(0)
  })

  it('Should return only assets from specified brand', async () => {
    await assetRepository.create({
      id: 'asset-01',
      assetCategoryId: 'caminhao-01',
      brand: 'VW',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    await assetRepository.create({
      id: 'asset-02',
      assetCategoryId: 'caminhao-02',
      brand: 'Ford',
      model: 'F-150',
      plate: 'ABC1234',
      year: 2000,
    })

    await assetRepository.create({
      id: 'asset-03',
      assetCategoryId: 'caminhao-03',
      brand: 'VW',
      model: 'Constellation',
      plate: 'DEF5678',
      year: 2010,
    })

    const result = await sut.execute({ page: 1, brand: 'VW' })

    expect(result.assets.length).toEqual(2)
    expect(result.assets.every((asset) => asset.brand === 'VW')).toBe(true)
    expect(result.currentPage).toBe(1)
  })

  it('Should handle pagination correctly', async () => {
    for (let i = 1; i <= 25; i++) {
      await assetRepository.create({
        id: `asset-${i.toString().padStart(2, '0')}`,
        assetCategoryId: `category-${i}`,
        brand: 'VW',
        model: `Model-${i}`,
        plate: `ABC${i.toString().padStart(4, '0')}`,
        year: 2000 + i,
      })
    }

    const page1 = await sut.execute({ page: 1, brand: 'VW' })
    const page2 = await sut.execute({ page: 2, brand: 'VW' })

    expect(page1.assets.length).toEqual(20)
    expect(page1.currentPage).toBe(1)
    expect(page1.totalPages).toBe(2)
    expect(page1.totalItems).toBe(25)

    expect(page2.assets.length).toEqual(5)
    expect(page2.currentPage).toBe(2)
  })

  it('Should return empty array for invalid page number', async () => {
    await assetRepository.create({
      id: 'asset-01',
      assetCategoryId: 'caminhao-01',
      brand: 'VW',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    const result = await sut.execute({ page: 999, brand: 'VW' })

    expect(result.assets.length).toEqual(0)
    expect(result.currentPage).toBe(999)
    expect(result.totalItems).toBe(1) // total items = 1 even if page is empty
  })
})
