import { describe, it, expect, beforeEach } from 'vitest'
import { GetMeasurementBulletinUseCase } from '../../measurement-bulletin/get-measurement-bulletin-use-case'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let repo: InMemoryMeasurementBulletinRepository
let sut: GetMeasurementBulletinUseCase

describe('Get Measurement Bulletin', () => {
  beforeEach(() => {
    repo = new InMemoryMeasurementBulletinRepository()
    sut = new GetMeasurementBulletinUseCase(repo)
  })

  it('should return a bulletin by id', async () => {
    const created = await repo.create({
      contractId: 'contract-01',
      assetMovementId: 'movement-01',
      reference_start: new Date('2026-02-01'),
      reference_end: new Date('2026-02-28'),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 500,
      total_value: 15000,
    })

    const result = await sut.execute({ id: created.id })

    expect(result.measurementBulletin).toBeDefined()
    expect(result.measurementBulletin.id).toBe(created.id)
    expect(Number(result.measurementBulletin.total_value)).toBe(15000)
  })

  it('should throw when bulletin is not found', async () => {
    await expect(
      sut.execute({ id: 'non-existent' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
