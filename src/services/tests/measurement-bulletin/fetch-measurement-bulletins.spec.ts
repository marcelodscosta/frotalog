import { describe, it, expect, beforeEach } from 'vitest'
import { FetchMeasurementBulletinsUseCase } from '../../measurement-bulletin/fetch-measurement-bulletins-use-case'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'

let repo: InMemoryMeasurementBulletinRepository
let sut: FetchMeasurementBulletinsUseCase

describe('Fetch Measurement Bulletins', () => {
  beforeEach(async () => {
    repo = new InMemoryMeasurementBulletinRepository()
    sut = new FetchMeasurementBulletinsUseCase(repo)

    // Create bulletins for different contracts
    await repo.create({
      contractId: 'contract-01',
      assetMovementId: 'movement-01',
      reference_start: new Date('2026-01-01'),
      reference_end: new Date('2026-01-31'),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 500,
      total_value: 15000,
    })

    await repo.create({
      contractId: 'contract-01',
      assetMovementId: 'movement-02',
      reference_start: new Date('2026-02-01'),
      reference_end: new Date('2026-02-28'),
      total_days: 30,
      inactive_days: 2,
      working_days: 28,
      daily_rate: 500,
      total_value: 14000,
    })

    await repo.create({
      contractId: 'contract-02',
      assetMovementId: 'movement-03',
      reference_start: new Date('2026-01-01'),
      reference_end: new Date('2026-01-31'),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 300,
      total_value: 9000,
    })
  })

  it('should fetch all bulletins paginated', async () => {
    const result = await sut.execute({ page: 1 })

    expect(result.bulletins.items).toHaveLength(3)
    expect(result.bulletins.totalItems).toBe(3)
  })

  it('should filter by contractId', async () => {
    const result = await sut.execute({
      contractId: 'contract-01',
      page: 1,
    })

    expect(result.bulletins.items).toHaveLength(2)
    expect(
      result.bulletins.items.every(
        (b) => b.contractId === 'contract-01',
      ),
    ).toBe(true)
  })

  it('should filter by status', async () => {
    const result = await sut.execute({
      status: 'DRAFT',
      page: 1,
    })

    expect(result.bulletins.items).toHaveLength(3) // All default to DRAFT
  })

  it('should return empty when no bulletins match', async () => {
    const result = await sut.execute({
      contractId: 'contract-99',
      page: 1,
    })

    expect(result.bulletins.items).toHaveLength(0)
  })
})
