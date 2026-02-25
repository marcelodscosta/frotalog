import { describe, it, expect, beforeEach } from 'vitest'
import { GetMaintenanceBySerialNumberUseCase } from '../../maintenance/get-maintenance-by-serial-number-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: GetMaintenanceBySerialNumberUseCase

describe('Get Maintenance By Serial Number Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new GetMaintenanceBySerialNumberUseCase(maintenanceRepository)

    // Our mock attaches serial_number "123" to all records
    await maintenanceRepository.create({
        asset: { connect: { id: `asset-1` } },
        supplier: { connect: { id: `supplier-1` } },
        type: 'PREVENTIVE',
        description: `Test Maintenance 1`,
        scheduled_date: new Date(),
        status: 'SCHEDULED',
    })
  })

  it('should get maintenances filtered by serial number', async () => {
    const response = await sut.execute({ serialNumber: '123', page: 1 })

    expect(response.maintenances).toHaveLength(1)
    expect(response.totalItems).toEqual(1)
  })

  it('should return empty list for non-existing serial number', async () => {
    const response = await sut.execute({ serialNumber: '999', page: 1 })

    expect(response.maintenances).toHaveLength(0)
    expect(response.totalItems).toEqual(0)
  })
})
