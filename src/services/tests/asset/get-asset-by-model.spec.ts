import { describe, beforeEach, it, expect } from 'vitest'
import { IAssetRepository } from '../../../repositories/interfaces/IAssetRepository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { GetAssetByModelUseCase } from '../../asset/get-asset-by-model-use-case'

describe('Find Asset by model', () => {
  let assetRepository: IAssetRepository
  let sut: GetAssetByModelUseCase

  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    sut = new GetAssetByModelUseCase(assetRepository)
  })

  it('Should to find Asset by model', async () => {
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

    const { assets } = await sut.execute({ page: 1, model: '4897' })

    expect(assets.length).toEqual(1)
  })
  it('Should return empty array when no assets found for model', async () => {
    await assetRepository.create({
      id: 'asset-01',
      assetCategoryId: 'caminhao-01',
      brand: 'Ford',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    const { assets } = await sut.execute({ page: 1, model: 'Fiat' })

    expect(assets.length).toEqual(0)
    expect(assets).toEqual([])
  })

  it('Should return only assets from specified model', async () => {
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
      model: 'Constellation',
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

    const { assets } = await sut.execute({ page: 1, model: 'Constellation' })

    expect(assets.length).toEqual(2)
  })

  it('Should handle pagination correctly', async () => {
    for (let i = 1; i <= 25; i++) {
      await assetRepository.create({
        id: `asset-${i.toString().padStart(2, '0')}`,
        assetCategoryId: `category-${i}`,
        brand: `Marca-${i}`,
        model: 'Caminhonete',
        plate: `ABC${i.toString().padStart(4, '0')}`,
        year: 2000 + i,
      })
    }

    const page1 = await sut.execute({ page: 1, model: 'Caminhonete' })
    const page2 = await sut.execute({ page: 2, model: 'Caminhonete' })

    expect(page1.assets.length).toEqual(20)
    expect(page2.assets.length).toEqual(5)
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

    const { assets } = await sut.execute({ page: 999, model: '136-05' })

    expect(assets.length).toEqual(0)
  })
})
