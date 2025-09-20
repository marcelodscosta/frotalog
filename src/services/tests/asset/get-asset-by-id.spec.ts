import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { GetAssetByIdUseCase } from '../../asset/get-asset-by-id-use-case'

let assetRepository: InMemoryAssetRepository
let sut: GetAssetByIdUseCase

describe('Find Assets by id', () => {
  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    sut = new GetAssetByIdUseCase(assetRepository)
  })
  it('Should to find Asset by id', async () => {
    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d8',
      assetCategoryId: 'caminhao-01',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d9',
      assetCategoryId: 'caminhao-02',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    const { asset } = await sut.execute({
      id: '275733ca-e69f-4e04-afae-bb8013a335d9',
    })
    expect(asset?.brand).toBe('FORD')
  })
  it('Should return null when Asset is not found', async () => {
    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d8',
      assetCategoryId: 'caminhao-01',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })

    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d9',
      assetCategoryId: 'caminhao-02',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
    })
    const result = await sut.execute({ id: 'id-inexistente' })
    expect(result.asset).toBeNull()
  })
})
