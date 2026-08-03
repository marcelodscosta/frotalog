import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateInvoiceUseCase } from '../../invoice/create-invoice-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { prisma } from '../../../lib/prisma'

// Mock prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(async (callback) => callback(prisma)),
    invoice: {
      findFirst: vi.fn(),
      count: vi.fn(),
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
    
    // Default mock setup for transaction methods
    vi.spyOn(prisma.invoice, 'create').mockImplementation(async (args: any) => {
      return { id: 'new-invoice-id', ...args.data }
    })
    vi.spyOn(prisma.measurementBulletin, 'updateMany').mockResolvedValue({ count: 1 })
    vi.spyOn(prisma.companySettings, 'findFirst').mockResolvedValue({ invoice_start_number: 1 } as any)
  })

  it('should auto-generate invoice number based on the highest invoice_number string', async () => {
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

    // Mock findFirst to return an invoice with FAT-000005
    const findFirstSpy = vi.spyOn(prisma.invoice, 'findFirst').mockResolvedValue({
      id: 'invoice-01',
      invoice_number: 'FAT-000005',
    } as any)

    const result = await sut.execute({
      measurementBulletinIds: ['bulletin-01'],
      issue_date: new Date(),
      due_date: new Date(),
    })

    // Verify findFirst was called with the correct parameters
    expect(findFirstSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: { invoice_number: { not: null } },
      orderBy: { invoice_number: 'desc' }
    }))

    // Verify the next number is FAT-000006
    expect(result.invoice.invoice_number).toBe('FAT-000006')
  })

  it('should not break the sequence if the last created invoice lacks an invoice_number', async () => {
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

    // Suppose the highest invoice number string in the DB is FAT-000008, 
    // findFirst will correctly return it because of the 'not: null' and ordering
    vi.spyOn(prisma.invoice, 'findFirst').mockResolvedValue({
      id: 'invoice-03',
      invoice_number: 'FAT-000008',
    } as any)

    const result = await sut.execute({
      measurementBulletinIds: ['bulletin-02'],
      issue_date: new Date(),
      due_date: new Date(),
    })

    // Verify the next number is FAT-000009
    expect(result.invoice.invoice_number).toBe('FAT-000009')
  })
})
