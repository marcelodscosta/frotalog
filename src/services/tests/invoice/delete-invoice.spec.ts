import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteInvoiceUseCase } from '../../invoice/delete-invoice-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { InMemoryBankAccountRepository } from '../../../repositories/in-memory/in-memory-bank-account-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { prisma } from '../../../lib/prisma'

// Mock prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn((callback) => callback(prisma)),
    bankAccount: {
      update: vi.fn(),
    },
    financialTransaction: {
      delete: vi.fn(),
    },
    measurementBulletin: {
      update: vi.fn(),
    },
    invoice: {
      update: vi.fn(),
    },
  },
}))

let invoiceRepo: InMemoryInvoiceRepository
let bulletinRepo: InMemoryMeasurementBulletinRepository
let bankAccountRepo: InMemoryBankAccountRepository
let sut: DeleteInvoiceUseCase

describe('Delete Invoice', () => {
  beforeEach(async () => {
    invoiceRepo = new InMemoryInvoiceRepository()
    bulletinRepo = new InMemoryMeasurementBulletinRepository()
    bankAccountRepo = new InMemoryBankAccountRepository()
    sut = new DeleteInvoiceUseCase(invoiceRepo, bulletinRepo, bankAccountRepo)

    // Create a bulletin and set it to INVOICED
    await bulletinRepo.create({
      id: 'bulletin-01',
      contractId: 'contract-01',
      assetMovementId: 'movement-01',
      reference_start: new Date('2026-02-01'),
      reference_end: new Date('2026-02-28'),
      total_days: 30,
      inactive_days: 0,
      working_days: 30,
      daily_rate: 500,
      total_value: 15000,
      status: 'INVOICED',
    })
  })

  it('should delete an invoice and revert bulletin status to APPROVED', async () => {
    const invoice = await invoiceRepo.create({
      measurementBulletins: {
        connect: [{ id: 'bulletin-01' }]
      } as any,
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
    })

    // Mock the findByIdWithDetails return
    vi.spyOn(invoiceRepo, 'findByIdWithDetails').mockResolvedValue({
      ...invoice,
      measurementBulletins: [{ id: 'bulletin-01' }],
      transactions: [],
    } as any)

    // Mock the successful returns of the transaction operations
    const invoiceUpdateSpy = vi.spyOn(prisma.invoice, 'update').mockResolvedValue({ ...invoice, is_active: false })
    const bulletinUpdateSpy = vi.spyOn(prisma.measurementBulletin, 'update').mockResolvedValue({} as any)

    const result = await sut.execute(invoice.id)

    expect(result.is_active).toBe(false)
    expect(invoiceUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: invoice.id },
        data: { is_active: false }
    }))
    expect(bulletinUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'bulletin-01' },
        data: expect.objectContaining({ status: 'APPROVED' })
    }))
  })

  it('should throw when invoice does not exist', async () => {
    await expect(
      sut.execute('non-existent'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should revert bank balance and delete transactions when deleting a paid invoice', async () => {
    const invoice = await invoiceRepo.create({
      invoice_number: 'FAT-000002',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 1000,
      status: 'PAID',
    })

    const bankAccount = await bankAccountRepo.create({
        name: 'Bank 01',
        balance: 2000,
    })

    const transaction = {
        id: 'trans-01',
        amount: 1000,
        bankAccountId: bankAccount.id,
    }

    vi.spyOn(invoiceRepo, 'findByIdWithDetails').mockResolvedValue({
      ...invoice,
      measurementBulletins: [],
      transactions: [transaction],
    } as any)

    const bankUpdateSpy = vi.spyOn(prisma.bankAccount, 'update').mockResolvedValue({} as any)
    const transactionDeleteSpy = vi.spyOn(prisma.financialTransaction, 'delete').mockResolvedValue({} as any)
    vi.spyOn(prisma.invoice, 'update').mockResolvedValue({ ...invoice, is_active: false })

    await sut.execute(invoice.id)

    expect(bankUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: bankAccount.id },
        data: { balance: { decrement: 1000 } }
    }))
    expect(transactionDeleteSpy).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'trans-01' }
    }))
  })
})
