import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { InMemoryAssetReadingsRepository } from '../../../repositories/in-memory/in-memory-asset-readings-repository'
import { CreateAssetReadingUseCase } from '../../operational/create-asset-reading-use-case'
import { AppError } from '../../errors/app-error'

let assetRepository: InMemoryAssetRepository
let assetReadingsRepository: InMemoryAssetReadingsRepository
let sut: CreateAssetReadingUseCase

describe('Create Asset Reading Use Case', () => {
  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository()
    assetReadingsRepository = new InMemoryAssetReadingsRepository()

    sut = new CreateAssetReadingUseCase(
      assetRepository,
      assetReadingsRepository,
    )
  })

  it('should be able to create a new asset reading', async () => {
    const asset = await assetRepository.create({
      brand: 'Volvo',
      model: 'FH 460',
      assetCategoryId: 'category-id',
      current_horometer: 100,
      current_odometer: 1000,
    })

    const { reading } = await sut.execute({
      assetId: asset.id,
      date: new Date(),
      horometer: 120, // Greater than 100
      odometer: 1200, // Greater than 1000
    })

    expect(reading.id).toEqual(expect.any(String))
    expect(reading.horometer).toEqual(120)
    expect(reading.odometer).toEqual(1200)

    // Check if asset's current values were updated
    const updatedAsset = await assetRepository.findById(asset.id)
    expect(updatedAsset?.current_horometer).toEqual(120)
    expect(updatedAsset?.current_odometer).toEqual(1200)
  })

  it('should not be able to create a reading with horometer less than or equal to current', async () => {
    const asset = await assetRepository.create({
      brand: 'Volvo',
      model: 'FH 460',
      assetCategoryId: 'category-id',
      current_horometer: 100,
    })

    await expect(() =>
      sut.execute({
        assetId: asset.id,
        date: new Date(),
        horometer: 100, // Equal to current
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(() =>
      sut.execute({
        assetId: asset.id,
        date: new Date(),
        horometer: 90, // Less than current
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a reading with odometer less than or equal to current', async () => {
    const asset = await assetRepository.create({
      brand: 'Volvo',
      model: 'FH 460',
      assetCategoryId: 'category-id',
      current_odometer: 1000,
    })

    await expect(() =>
      sut.execute({
        assetId: asset.id,
        date: new Date(),
        odometer: 1000, // Equal to current
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(() =>
      sut.execute({
        assetId: asset.id,
        date: new Date(),
        odometer: 990, // Less than current
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
