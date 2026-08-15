import { beforeEach, describe, expect, it } from 'vitest'
import { Prisma } from '../../../generated/prisma'
import { InMemoryAssetMovementRepository } from '../../../repositories/in-memory/in-memory-asset-movement-repository'
import { InMemoryContractRepository } from '../../../repositories/in-memory/in-memory-contract-repository'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { InMemoryCommissionRepository } from '../../../repositories/in-memory/in-memory-commission-repository'
import { CreateMeasurementBulletinUseCase } from '../../measurement-bulletin/create-measurement-bulletin-use-case'

let measurementBulletinRepository: InMemoryMeasurementBulletinRepository
let assetMovementRepository: InMemoryAssetMovementRepository
let contractRepository: InMemoryContractRepository
let maintenanceRepository: InMemoryMaintenanceRepository
let commissionRepository: InMemoryCommissionRepository
let sut: CreateMeasurementBulletinUseCase

describe('Create Measurement Bulletin Use Case', () => {
  beforeEach(() => {
    measurementBulletinRepository = new InMemoryMeasurementBulletinRepository()
    assetMovementRepository = new InMemoryAssetMovementRepository()
    contractRepository = new InMemoryContractRepository()
    maintenanceRepository = new InMemoryMaintenanceRepository()
    commissionRepository = new InMemoryCommissionRepository()

    sut = new CreateMeasurementBulletinUseCase(
      measurementBulletinRepository,
      assetMovementRepository,
      contractRepository,
      maintenanceRepository,
      commissionRepository
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

  it('should automatically create a commission if the contract has a seller and percentage configured', async () => {
    await contractRepository.create({
      id: 'contract-comission',
      clientId: 'client-1',
      contract_number: '1234',
      start_date: new Date(),
      sellerId: 'seller-1',
      commission_percentage: new Prisma.Decimal('10.00'), // 10%
    })

    await assetMovementRepository.create({
      id: 'movement-comission',
      contractId: 'contract-comission',
      assetId: 'asset-1',
      rental_value: new Prisma.Decimal('10000'),
      billing_cycle: 'MONTHLY',
      calculation_rule: 'COMMERCIAL_30_DAYS',
    })

    const { measurementBulletin } = await sut.execute({
      contractId: 'contract-comission',
      assetMovementId: 'movement-comission',
      reference_start: new Date('2026-03-01T03:00:00.000Z'),
      reference_end: new Date('2026-03-31T03:00:00.000Z'),
    })

    expect(Number(measurementBulletin.total_value)).toBe(10000)

    const commissions = commissionRepository.items
    expect(commissions).toHaveLength(1)
    expect(commissions[0].contractId).toBe('contract-comission')
    expect(commissions[0].sellerId).toBe('seller-1')
    expect(Number(commissions[0].commission_percentage)).toBe(10)
    // 10% de 10000 = 1000
    expect(Number(commissions[0].commission_value)).toBe(1000)
    expect(commissions[0].measurementBulletinId).toBe(measurementBulletin.id)
    expect(commissions[0].reference_month.getUTCMonth()).toBe(2) // March is 2 (0-indexed)
  })

  it('should NOT create a commission if measurement bulletin is outside commission validity dates', async () => {
    await contractRepository.create({
      id: 'contract-comission-expired',
      clientId: 'client-1',
      contract_number: '12345',
      start_date: new Date('2025-01-01T00:00:00.000Z'),
      sellerId: 'seller-1',
      commission_percentage: new Prisma.Decimal('10.00'),
      // commission valid only until end of 2025
      commission_start_date: new Date('2025-01-01T00:00:00.000Z'),
      commission_end_date: new Date('2025-12-31T23:59:59.000Z'),
    })

    await assetMovementRepository.create({
      id: 'movement-comission-expired',
      contractId: 'contract-comission-expired',
      assetId: 'asset-1',
      rental_value: new Prisma.Decimal('10000'),
      billing_cycle: 'MONTHLY',
      calculation_rule: 'COMMERCIAL_30_DAYS',
    })

    // Bulletin in 2026
    await sut.execute({
      contractId: 'contract-comission-expired',
      assetMovementId: 'movement-comission-expired',
      reference_start: new Date('2026-01-01T03:00:00.000Z'),
      reference_end: new Date('2026-01-31T03:00:00.000Z'),
    })

    const commissions = commissionRepository.items
    expect(commissions).toHaveLength(0) // No commission should be generated
  })
})
