import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateMaintenanceStatusUseCase } from '../../maintenance/update-maintenance-status-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { InMemoryAssetRepository } from '../../../repositories/in-memory/in-memory-asset.repository'
import { MaintenanceNotFoundError } from '../../errors/maintenance-not-found-error'

let maintenanceRepository: InMemoryMaintenanceRepository
let assetRepository: InMemoryAssetRepository
let sut: UpdateMaintenanceStatusUseCase

describe('Update Maintenance Status Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    assetRepository = new InMemoryAssetRepository()

    sut = new UpdateMaintenanceStatusUseCase(
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

    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'Test Maintenance',
      scheduled_date: new Date('2026-03-01'),
      status: 'SCHEDULED',
    })
    maintenanceRepository.maintenances[0].id = 'maintenance-01'
  })

  it('should be able to update maintenance status to IN_PROGRESS', async () => {
    const { maintenance } = await sut.execute({
      id: 'maintenance-01',
      status: 'IN_PROGRESS',
    })

    expect(maintenance.status).toEqual('IN_PROGRESS')
    expect(maintenance.started_date).toBeInstanceOf(Date)
    expect(maintenance.completed_date).toBeNull()
  })

  it('should be able to update maintenance status to COMPLETED and update asset counters', async () => {
    const { maintenance } = await sut.execute({
      id: 'maintenance-01',
      status: 'COMPLETED',
      horometer: 1100,
      odometer: 50200,
    })

    expect(maintenance.status).toEqual('COMPLETED')
    expect(maintenance.completed_date).toBeInstanceOf(Date)

    const updatedAsset = await assetRepository.findById('asset-01')
    expect(updatedAsset?.current_horometer).toEqual(1100)
    expect(updatedAsset?.current_odometer).toEqual(50200)
    expect(updatedAsset?.last_maintenance_horometer).toEqual(1100)
    expect(updatedAsset?.last_maintenance_odometer).toEqual(50200)
    expect(updatedAsset?.last_maintenance_date).toBeInstanceOf(Date)
  })

  it('should not be able to update status of a non-existing maintenance', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid-id',
        status: 'IN_PROGRESS',
      }),
    ).rejects.toBeInstanceOf(MaintenanceNotFoundError)
  })
})
