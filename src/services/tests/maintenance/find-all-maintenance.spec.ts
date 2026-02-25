import { describe, it, expect, beforeEach } from 'vitest'
import { FindAllMaintenanceUseCase } from '../../maintenance/find-all-maintenance-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: FindAllMaintenanceUseCase

describe('Find All Maintenance Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new FindAllMaintenanceUseCase(maintenanceRepository)

    for (let i = 1; i <= 25; i++) {
        await maintenanceRepository.create({
            asset: { connect: { id: `asset-${i}` } },
            supplier: { connect: { id: `supplier-${i}` } },
            type: 'PREVENTIVE',
            description: `Test Maintenance ${i}`,
            scheduled_date: new Date(`2026-03-${i.toString().padStart(2, '0')}`),
            status: 'SCHEDULED',
        })
    }
  })

  it('should be able to fetch paginated maintenances', async () => {
    const response = await sut.execute({ page: 1 })

    expect(response.maintenances).toHaveLength(20)
    expect(response.currentPage).toEqual(1)
    expect(response.pageSize).toEqual(20)
    expect(response.totalItems).toEqual(25)
    expect(response.totalPages).toEqual(2)
  })

  it('should be able to fetch second page of maintenances', async () => {
    const response = await sut.execute({ page: 2 })

    expect(response.maintenances).toHaveLength(5)
    expect(response.currentPage).toEqual(2)
  })
})
