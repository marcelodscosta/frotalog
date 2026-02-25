import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { GetScheduledMaintenancesUseCase } from '../../maintenance/get-scheduled-maintenances-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let maintenanceRepository: InMemoryMaintenanceRepository
let sut: GetScheduledMaintenancesUseCase

describe('Get Scheduled Maintenances Use Case', () => {
  beforeEach(async () => {
    maintenanceRepository = new InMemoryMaintenanceRepository()
    sut = new GetScheduledMaintenancesUseCase(maintenanceRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should group maintenances into delayed, today, and future', async () => {
    // Mock current date to a fixed point in time
    const mockedToday = new Date(2026, 1, 15, 12, 0, 0) // Feb 15, 2026, 12:00:00
    vi.setSystemTime(mockedToday)

    // Delayed: 2 days ago
    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-1' } },
      supplier: { connect: { id: 'supplier-1' } },
      type: 'PREVENTIVE',
      description: 'Delayed',
      scheduled_date: new Date(2026, 1, 13, 10, 0, 0),
      status: 'SCHEDULED', // Only scheduled matters
    })

    // Today: Today
    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-2' } },
      supplier: { connect: { id: 'supplier-1' } },
      type: 'PREVENTIVE',
      description: 'Today Task',
      scheduled_date: new Date(2026, 1, 15, 14, 0, 0),
      status: 'SCHEDULED',
    })

    // Future: 3 days from now
    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-3' } },
      supplier: { connect: { id: 'supplier-1' } },
      type: 'PREVENTIVE',
      description: 'Future Task',
      scheduled_date: new Date(2026, 1, 18, 9, 0, 0),
      status: 'SCHEDULED',
    })

    // Future > 7 days
    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-4' } },
      supplier: { connect: { id: 'supplier-1' } },
      type: 'PREVENTIVE',
      description: 'Far Future Task',
      scheduled_date: new Date(2026, 1, 25, 9, 0, 0), // 10 days later
      status: 'SCHEDULED',
    })
    
    // Ignored (Not Scheduled)
    await maintenanceRepository.create({
      asset: { connect: { id: 'asset-5' } },
      supplier: { connect: { id: 'supplier-1' } },
      type: 'PREVENTIVE',
      description: 'Completed Task',
      scheduled_date: new Date(2026, 1, 10, 9, 0, 0),
      status: 'COMPLETED',
    })

    const response = await sut.execute()

    expect(response.all).toHaveLength(4)
    expect(response.delayed).toHaveLength(1)
    expect(response.delayed[0].description).toEqual('Delayed')
    expect(response.delayed[0].daysDelayed).toEqual(2)

    expect(response.today).toHaveLength(1)
    expect(response.today[0].description).toEqual('Today Task')

    expect(response.future).toHaveLength(2)
    
    expect(response.summary).toEqual({
      total: 4,
      totalDelayed: 1,
      totalToday: 1,
      totalFuture: 2,
      totalNext7Days: 1, // Only the 'Future Task' (3 days away)
      totalNext30Days: 2, // Both 'Future Task' and 'Far Future Task'
    })
  })
})
