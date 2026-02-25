import { describe, it, expect, beforeEach } from 'vitest'
import { CreateQuickMaintenanceUseCase } from '../../maintenance/create-quick-maintenance-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { AssetNotFoundError } from '../../errors/asset-not-found-error'

let maintenanceRepository: InMemoryMaintenanceRepository
let assetRepository: InMemoryAssetRepository
let sut: CreateQuickMaintenanceUseCase

describe('Create Quick Maintenance Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    assetRepository = new InMemoryAssetRepository()
    
    sut = new CreateQuickMaintenanceUseCase(
      maintenanceRepository,
      assetRepository as any,
    )

    await assetRepository.create({
      id: 'asset-01',
      brand: 'Caterpillar',
      model: '320D',
      plate: 'CAT-0001',
      serial_number: 'CAT123',
      year: 2022,
      current_horometer: 1000,
      current_odometer: 50000,
      category: { connect: { id: 'category-01' } },
    } as any)
  })

  it('should be able to create a quick maintenance and update asset counters', async () => {
    const maintenanceDate = new Date('2026-02-25')

    const { maintenance } = await sut.execute({
      assetId: 'asset-01',
      description: 'Lava-rápido + Calibragem',
      date: maintenanceDate,
      horometer: 1050,
      odometer: 50100,
    })

    expect(maintenance.id).toEqual(expect.any(String))
    expect(maintenance.status).toEqual('COMPLETED')
    expect(maintenance.type).toEqual('PREVENTIVE')
    expect(maintenance.completed_date).toEqual(maintenanceDate)
    
    // Check asset updates
    const updatedAsset = await assetRepository.findById('asset-01')
    expect(updatedAsset?.current_horometer).toEqual(1050)
    expect(updatedAsset?.current_odometer).toEqual(50100)
    expect(updatedAsset?.last_maintenance_date).toEqual(maintenanceDate)
    expect(updatedAsset?.last_maintenance_horometer).toEqual(1050)
    expect(updatedAsset?.last_maintenance_odometer).toEqual(50100)
  })

  it('should update asset last counters but not current ones if new ones are lower', async () => {
    const maintenanceDate = new Date('2026-02-25')

    await sut.execute({
      assetId: 'asset-01',
      description: 'Revisão retroativa',
      date: maintenanceDate,
      horometer: 900, // lower than current 1000
    })

    const updatedAsset = await assetRepository.findById('asset-01')
    expect(updatedAsset?.current_horometer).toEqual(1000) // Unchanged
    expect(updatedAsset?.last_maintenance_horometer).toEqual(900) // Updated
  })

  it('should not be able to create a quick maintenance for a non-existing asset', async () => {
    await expect(() =>
      sut.execute({
        assetId: 'invalid-asset',
        description: 'Lava-rápido',
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AssetNotFoundError)
  })
})
