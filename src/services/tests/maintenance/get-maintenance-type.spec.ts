import { describe, it, expect, beforeEach } from 'vitest'
import { GetMaintenanceByTypeUseCase } from '../../maintenance/get-maintenance-type-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: GetMaintenanceByTypeUseCase

describe('Get Maintenance By Type Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new GetMaintenanceByTypeUseCase(maintenanceRepository)

    await maintenanceRepository.create({
        asset: { connect: { id: `asset-1` } },
        supplier: { connect: { id: `supplier-1` } },
        type: 'CORRECTIVE',
        description: `Broken engine`,
        scheduled_date: new Date(),
        status: 'IN_PROGRESS',
    })

    await maintenanceRepository.create({
        asset: { connect: { id: `asset-2` } },
        supplier: { connect: { id: `supplier-2` } },
        type: 'PREVENTIVE',
        description: `Oil change`,
        scheduled_date: new Date(),
        status: 'SCHEDULED',
    })
  })

  it('should get maintenances filtered by type', async () => {
    const response = await sut.execute({ type: 'CORRECTIVE', page: 1 })

    expect(response.maintenances).toHaveLength(1)
    expect(response.maintenances[0].type).toEqual('CORRECTIVE')
    expect(response.totalItems).toEqual(1)
  })

  it('should return empty list for type with no maintenances', async () => {
    const response = await sut.execute({ type: 'EMERGENCY', page: 1 })

    expect(response.maintenances).toHaveLength(0)
    expect(response.totalItems).toEqual(0)
  })
})
