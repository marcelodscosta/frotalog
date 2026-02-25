import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteMeasurementBulletinUseCase } from '../../measurement-bulletin/delete-measurement-bulletin-use-case'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let repo: InMemoryMeasurementBulletinRepository
let sut: DeleteMeasurementBulletinUseCase

describe('Delete Measurement Bulletin', () => {
  beforeEach(() => {
    repo = new InMemoryMeasurementBulletinRepository()
    sut = new DeleteMeasurementBulletinUseCase(repo)
  })

  it('should delete a bulletin', async () => {
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

    const result = await sut.execute(created.id)

    expect(result).toBeDefined()
    expect(result.is_active).toBe(false)
  })

  it('should throw when bulletin does not exist', async () => {
    await expect(
      sut.execute('non-existent'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
