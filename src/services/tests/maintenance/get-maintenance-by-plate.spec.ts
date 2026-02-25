import { describe, it, expect, beforeEach } from 'vitest'
import { GetMaintenanceByPlateUseCase } from '../../maintenance/get-maintenance-by-plate-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: GetMaintenanceByPlateUseCase

describe('Get Maintenance By Plate Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new GetMaintenanceByPlateUseCase(maintenanceRepository)

    // The InMemoryMaintenanceRepository sets a mock asset plate 'MOC-0000' for ALL created records
    // So all records will share the MOC-0000 plate in this simple mock
    await maintenanceRepository.create({
        asset: { connect: { id: `asset-1` } },
        supplier: { connect: { id: `supplier-1` } },
        type: 'PREVENTIVE',
        description: `Test Maintenance 1`,
        scheduled_date: new Date(),
        status: 'SCHEDULED',
    })
    
    await maintenanceRepository.create({
        asset: { connect: { id: `asset-2` } },
        supplier: { connect: { id: `supplier-2` } },
        type: 'PREVENTIVE',
        description: `Test Maintenance 2`,
        scheduled_date: new Date(),
        status: 'SCHEDULED',
    })
  })

  it('should get maintenances filtered by plate', async () => {
    const response = await sut.execute({ plate: 'MOC-0000', page: 1 })

    // Our mock gives everyone MOC-0000
    expect(response.maintenances).toHaveLength(2)
    expect(response.totalItems).toEqual(2)
  })

  it('should return empty list for non-existing plate', async () => {
    const response = await sut.execute({ plate: 'ABC-1234', page: 1 })

    expect(response.maintenances).toHaveLength(0)
    expect(response.totalItems).toEqual(0)
  })
})
