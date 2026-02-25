import { describe, it, expect, beforeEach } from 'vitest'
import { GetMaintenanceByIdUseCase } from '../../maintenance/get-maintenance-by-id-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { MaintenanceNotFoundError } from '../../errors/maintenance-not-found-error'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: GetMaintenanceByIdUseCase

describe('Get Maintenance By Id Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new GetMaintenanceByIdUseCase(maintenanceRepository)

    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'Test Get',
      scheduled_date: new Date('2026-03-01'),
      status: 'SCHEDULED',
    })
    maintenanceRepository.maintenances[0].id = 'maintenance-01'
  })

  it('should be able to get a maintenance by id', async () => {
    const { maintenance } = await sut.execute({
      id: 'maintenance-01',
    })

    expect(maintenance.id).toEqual('maintenance-01')
    expect(maintenance.description).toEqual('Test Get')
    // Check if the mock relations (mapped by InMemoryRepository) are present
    expect(maintenance.asset).toEqual(expect.any(Object))
    expect(maintenance.supplier).toEqual(expect.any(Object))
  })

  it('should not be able to get a maintenance with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(MaintenanceNotFoundError)
  })
})
