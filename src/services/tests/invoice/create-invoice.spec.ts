import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateInvoiceUseCase } from '../../invoice/create-invoice-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { prisma } from '../../../lib/prisma'

// Mock prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(async (callback) => callback(prisma)),
    $executeRaw: vi.fn(),
    invoice: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    measurementBulletin: {
      updateMany: vi.fn(),
    },
    companySettings: {
      findFirst: vi.fn(),
    },
  },
}))

let invoiceRepo: InMemoryInvoiceRepository
let bulletinRepo: InMemoryMeasurementBulletinRepository
let sut: CreateInvoiceUseCase

describe('Create Invoice', () => {
  beforeEach(async () => {
    invoiceRepo = new InMemoryInvoiceRepository()
    bulletinRepo = new InMemoryMeasurementBulletinRepository()
    sut = new CreateInvoiceUseCase(invoiceRepo, bulletinRepo)

    vi.clearAllMocks()

    vi.spyOn(prisma.invoice, 'create').mockImplementation((async (args: any) => {
      return { id: 'new-invoice-id', ...args.data }
    }) as any)
    vi.spyOn(prisma.measurementBulletin, 'updateMany').mockResolvedValue({
      count: 1,
    })
    vi.spyOn(prisma.companySettings, 'findFirst').mockResolvedValue({
      invoice_start_number: 1,
    } as any)
  })

  it('should auto-generate invoice number based on the highest existing invoice_number', async () => {
    await bulletinRepo.create({
      id: 'bulletin-01',
      contractId: 'contract-01',
      assetMovementId: 'mov-01',
      reference_start: new Date(),
      reference_end: new Date(),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 100,
      total_value: 3000,
      status: 'APPROVED',
    })

    const findManySpy = vi
      .spyOn(prisma.invoice, 'findMany')
      .mockResolvedValue([{ invoice_number: 'FAT-000005' }] as any)

    const result = await sut.execute({
      measurementBulletinIds: ['bulletin-01'],
      issue_date: new Date(),
      due_date: new Date(),
    })

    expect(findManySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { invoice_number: { not: null } },
        select: { invoice_number: true },
      }),
    )
    expect(prisma.$executeRaw).toHaveBeenCalled()
    expect(result.invoice.invoice_number).toBe('FAT-000006')
  })

  it('should not break the sequence when there are gaps or non-numeric legacy numbers', async () => {
    await bulletinRepo.create({
      id: 'bulletin-02',
      contractId: 'contract-01',
      assetMovementId: 'mov-01',
      reference_start: new Date(),
      reference_end: new Date(),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 100,
      total_value: 3000,
      status: 'APPROVED',
    })

    vi.spyOn(prisma.invoice, 'findMany').mockResolvedValue([
      { invoice_number: 'FAT-000008' },
      { invoice_number: 'AVULSA-01' },
      { invoice_number: null },
    ] as any)

    const result = await sut.execute({
      measurementBulletinIds: ['bulletin-02'],
      issue_date: new Date(),
      due_date: new Date(),
    })

    expect(result.invoice.invoice_number).toBe('FAT-000009')
  })

  it('should skip numbers already used when the sequence has duplicates', async () => {
    await bulletinRepo.create({
      id: 'bulletin-03',
      contractId: 'contract-01',
      assetMovementId: 'mov-01',
      reference_start: new Date(),
      reference_end: new Date(),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 100,
      total_value: 3000,
      status: 'APPROVED',
    })

    vi.spyOn(prisma.invoice, 'findMany').mockResolvedValue([
      { invoice_number: 'FAT-000301' },
      { invoice_number: 'FAT-000301' },
      { invoice_number: 'FAT-000302' },
    ] as any)

    const result = await sut.execute({
      measurementBulletinIds: ['bulletin-03'],
      issue_date: new Date(),
      due_date: new Date(),
    })

    expect(result.invoice.invoice_number).toBe('FAT-000303')
  })
})
