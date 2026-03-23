import { beforeEach, describe, expect, it } from 'vitest'
import { Prisma } from '../../../generated/prisma'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { CreateMeasurementBulletinUseCase } from '../../measurement-bulletin/create-measurement-bulletin-use-case'

let measurementBulletinRepository: InMemoryMeasurementBulletinRepository
let assetMovementRepository: InMemoryAssetMovementRepository
let contractRepository: InMemoryContractRepository
let maintenanceRepository: InMemoryMaintenanceRepository
let sut: CreateMeasurementBulletinUseCase

describe('Create Measurement Bulletin Use Case', () => {
  beforeEach(() => {
    measurementBulletinRepository = new InMemoryMeasurementBulletinRepository()
    assetMovementRepository = new InMemoryAssetMovementRepository()
    contractRepository = new InMemoryContractRepository()
    maintenanceRepository = new InMemoryMaintenanceRepository()

    sut = new CreateMeasurementBulletinUseCase(
      measurementBulletinRepository,
      assetMovementRepository,
      contractRepository,
      maintenanceRepository,
    )
  })

  it('should calculate 30 commercial days for a full month in February', async () => {
    await contractRepository.create({
      id: 'contract-1',
      clientId: 'client-1',
      contract_number: '123',
      start_date: new Date(),
    })

    await assetMovementRepository.create({
      id: 'movement-1',
      contractId: 'contract-1',
      assetId: 'asset-1',
      rental_value: new Prisma.Decimal('39000'),
      billing_cycle: 'MONTHLY',
      calculation_rule: 'COMMERCIAL_30_DAYS',
    })

    const { measurementBulletin } = await sut.execute({
      contractId: 'contract-1',
      assetMovementId: 'movement-1',
      reference_start: new Date('2026-02-01T03:00:00.000Z'),
      reference_end: new Date('2026-02-28T03:00:00.000Z'),
    })

    expect(measurementBulletin.total_days).toBe(30)
    expect(Number(measurementBulletin.daily_rate)).toBe(1300)
    expect(Number(measurementBulletin.total_value)).toBe(39000)
  })

  it('should calculate exactly 28 calendar days for a full month in February if CALENDAR_DAYS is selected', async () => {
    await contractRepository.create({
      id: 'contract-1',
      clientId: 'client-1',
      contract_number: '123',
      start_date: new Date(),
    })

    await assetMovementRepository.create({
      id: 'movement-1',
      contractId: 'contract-1',
      assetId: 'asset-1',
      rental_value: new Prisma.Decimal('39000'),
      billing_cycle: 'MONTHLY',
      calculation_rule: 'CALENDAR_DAYS',
    })

    const { measurementBulletin } = await sut.execute({
      contractId: 'contract-1',
      assetMovementId: 'movement-1',
      reference_start: new Date('2026-02-01T03:00:00.000Z'),
      reference_end: new Date('2026-02-28T03:00:00.000Z'),
    })

    expect(measurementBulletin.total_days).toBe(28)
    
    // 39000 / 28 = 1392.85714... rounded = 1392.86
    expect(Number(measurementBulletin.daily_rate)).toBe(1392.86)
    
    // total value strictly equals working days (28) * exact rate (1392.857...)
    expect(Number(measurementBulletin.total_value)).toBe(39000)
  })
})
