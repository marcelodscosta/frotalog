import { describe, it, expect, beforeEach } from 'vitest'
import { MaintenanceByAssetUseCase } from '../../reports/maintenance-by-asset-use-case'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'

let repo: InMemoryMaintenanceRepository
let sut: MaintenanceByAssetUseCase

describe('Maintenance By Asset Report', () => {
  beforeEach(async () => {
    repo = new InMemoryMaintenanceRepository()
    sut = new MaintenanceByAssetUseCase(repo)

    // Create maintenances: asset-01 had maintenance from Jan 10-15 (6 days inoperative)
    await repo.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'CORRECTIVE',
      description: 'Troca de bomba hidráulica',
      scheduled_date: new Date('2026-01-08'),
      started_date: new Date('2026-01-10'),
      completed_date: new Date('2026-01-15'),
      status: 'COMPLETED',
      estimated_cost: 5000,
      actual_cost: 6200,
      equipment_inactive: true,
    })

    // Second maintenance: asset-01, Jan 25-27 (3 days)
    await repo.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-02' } },
      type: 'PREVENTIVE',
      description: 'Revisão periódica',
      scheduled_date: new Date('2026-01-24'),
      started_date: new Date('2026-01-25'),
      completed_date: new Date('2026-01-27'),
      status: 'COMPLETED',
      equipment_inactive: true,
    })

    // Another asset's maintenance (should not appear when filtering by asset-01)
    await repo.create({
      asset: { connect: { id: 'asset-02' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'EMERGENCY',
      description: 'Motor parou',
      scheduled_date: new Date('2026-01-15'),
      started_date: new Date('2026-01-15'),
      completed_date: new Date('2026-01-20'),
      status: 'COMPLETED',
      equipment_inactive: true,
    })
  })

  it('should generate report for a specific asset within a period', async () => {
    const result = await sut.execute({
      assetId: 'asset-01',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    })

    expect(result.maintenances).toHaveLength(2)
    expect(result.summary.totalMaintenances).toBe(2)
    expect(result.summary.totalDays).toBe(31)
  })

  it('should calculate operative vs inoperative days', async () => {
    const result = await sut.execute({
      assetId: 'asset-01',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    })

    // There should be inoperative days during maintenance periods
    expect(result.summary.inoperativeDays).toBeGreaterThan(0)
    expect(result.summary.operativeDays).toBeGreaterThan(0)
    expect(
      result.summary.operativeDays + result.summary.inoperativeDays,
    ).toBe(result.summary.totalDays)
  })

  it('should return daily status array', async () => {
    const result = await sut.execute({
      assetId: 'asset-01',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    })

    expect(result.dailyStatus).toBeDefined()
    expect(result.dailyStatus).toHaveLength(31) // 31 days in Jan

    // Each day should have date and status
    result.dailyStatus.forEach((day) => {
      expect(day.date).toBeDefined()
      expect(['OPERATIVE', 'INOPERATIVE']).toContain(day.status)
    })
  })

  it('should return empty maintenances when asset has no maintenance', async () => {
    const result = await sut.execute({
      assetId: 'asset-99',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    })

    expect(result.maintenances).toHaveLength(0)
    expect(result.summary.totalMaintenances).toBe(0)
    expect(result.summary.inoperativeDays).toBe(0)
    expect(result.summary.operativeDays).toBe(31)
  })

  it('should return all assets when assetId is undefined', async () => {
    const result = await sut.execute({
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    })

    expect(result.maintenances).toHaveLength(3) // All 3 maintenances
    expect(result.summary.totalMaintenances).toBe(3)
  })
})
