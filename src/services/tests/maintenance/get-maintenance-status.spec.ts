import { describe, it, expect, beforeEach } from 'vitest'
import { GetMaintenanceByStatusUseCase } from '../../maintenance/get-maintenance-status-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: GetMaintenanceByStatusUseCase

describe('Get Maintenance By Status Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new GetMaintenanceByStatusUseCase(maintenanceRepository)

    await maintenanceRepository.create({
        asset: { connect: { id: `asset-1` } },
        supplier: { connect: { id: `supplier-1` } },
        type: 'PREVENTIVE',
        description: `Scheduled Task`,
        scheduled_date: new Date(),
        status: 'SCHEDULED',
    })

    await maintenanceRepository.create({
        asset: { connect: { id: `asset-2` } },
        supplier: { connect: { id: `supplier-2` } },
        type: 'PREVENTIVE',
        description: `Completed Task`,
        scheduled_date: new Date(),
        status: 'COMPLETED',
    })
  })

  it('should get maintenances filtered by status', async () => {
    const response = await sut.execute({ status: 'SCHEDULED', page: 1 })

    expect(response.maintenances).toHaveLength(1)
    expect(response.maintenances[0].status).toEqual('SCHEDULED')
    expect(response.totalItems).toEqual(1)
  })

  it('should return empty list for status with no maintenances', async () => {
    const response = await sut.execute({ status: 'CANCELLED', page: 1 })

    expect(response.maintenances).toHaveLength(0)
    expect(response.totalItems).toEqual(0)
  })
})
