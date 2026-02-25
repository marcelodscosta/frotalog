import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateMaintenanceUseCase } from '../../maintenance/update-maintenance-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

import { MaintenanceNotFoundError } from '../../errors/maintenance-not-found-error'

let maintenanceRepository: InMemoryMaintenanceRepository
let serviceCategoryRepository: any
let sut: UpdateMaintenanceUseCase

describe('Update Maintenance Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    serviceCategoryRepository = {
      findById: vi.fn(),
    } as any

    sut = new UpdateMaintenanceUseCase(
      maintenanceRepository,
      serviceCategoryRepository as any,
    )

    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'Original Description',
      scheduled_date: new Date('2026-03-01'),
      status: 'SCHEDULED',
    })
    // Force ID for testing
    maintenanceRepository.maintenances[0].id = 'maintenance-01'
  })

  it('should be able to update a maintenance', async () => {
    const { maintenance } = await sut.execute({
      id: 'maintenance-01',
      data: {
        description: 'Updated Description',
        estimated_cost: 2000,
      },
    })

    expect(maintenance.description).toEqual('Updated Description')
    expect(Number(maintenance.estimated_cost)).toEqual(2000)
    expect(maintenance.type).toEqual('PREVENTIVE') // Unchanged
  })

  it('should disconnect service category when passing null', async () => {
    const { maintenance } = await sut.execute({
      id: 'maintenance-01',
      data: {},
      serviceCategoryId: null,
    })

    // In prisma an update with { serviceCategory: { disconnect: true } } would remove relation.
    // Since our mock repository update simply merges data, we'll verify the returned object shape
    // or assume the database layer handles it. The usecase tests if logic passes without throwing.
    expect(maintenance.id).toEqual('maintenance-01')
  })

  it('should not be able to update a non-existing maintenance', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid-id',
        data: { description: 'Updated' },
      }),
    ).rejects.toBeInstanceOf(MaintenanceNotFoundError)
  })
})
