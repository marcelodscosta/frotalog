import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { GetAssetBySerialNumberUseCase } from '../../asset/get-asset-by-serial-number-use-case'

let assetRepository: InMemoryAssetRepository
let sut: GetAssetBySerialNumberUseCase

describe('Find Assets by serial number', () => {
  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    sut = new GetAssetBySerialNumberUseCase(assetRepository)
  })
  it('Should to find Asset by id', async () => {
    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d8',
      assetCategoryId: 'caminhao-01',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
      serial_number: '000001',
    })

    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d9',
      assetCategoryId: 'caminhao-02',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
      serial_number: '000002',
    })

    const { asset } = await sut.execute({ serialNumber: '000002' })
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
      serial_number: '000001',
    })

    await assetRepository.create({
      id: '275733ca-e69f-4e04-afae-bb8013a335d9',
      assetCategoryId: 'caminhao-02',
      brand: 'FORD',
      model: '136-05',
      plate: 'PIC5864',
      year: 1995,
      serial_number: '000001',
    })
    const result = await sut.execute({ serialNumber: 'id-inexistente' })
    expect(result.asset).toBeNull()
  })
})
