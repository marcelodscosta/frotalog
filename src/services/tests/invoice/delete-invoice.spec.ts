import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteInvoiceUseCase } from '../../invoice/delete-invoice-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { InMemoryMeasurementBulletinRepository } from '../../../repositories/in-memory/in-memory-measurement-bulletin-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let invoiceRepo: InMemoryInvoiceRepository
let bulletinRepo: InMemoryMeasurementBulletinRepository
let sut: DeleteInvoiceUseCase

describe('Delete Invoice', () => {
  beforeEach(async () => {
    invoiceRepo = new InMemoryInvoiceRepository()
    bulletinRepo = new InMemoryMeasurementBulletinRepository()
    sut = new DeleteInvoiceUseCase(invoiceRepo, bulletinRepo)

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
      measurementBulletinId: 'bulletin-01',
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
    })

    const result = await sut.execute(invoice.id)

    expect(result.is_active).toBe(false)

    // Bulletin should revert to APPROVED
    const bulletin = await bulletinRepo.findById('bulletin-01')
    expect(bulletin?.status).toBe('APPROVED')
  })

  it('should throw when invoice does not exist', async () => {
    await expect(
      sut.execute('non-existent'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
