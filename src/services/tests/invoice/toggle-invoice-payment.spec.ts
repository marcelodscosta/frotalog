import { describe, it, expect, beforeEach } from 'vitest'
import { ToggleInvoicePaymentUseCase } from '../../invoice/toggle-invoice-payment-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let repo: InMemoryInvoiceRepository
let sut: ToggleInvoicePaymentUseCase

describe('Toggle Invoice Payment', () => {
  beforeEach(() => {
    repo = new InMemoryInvoiceRepository()
    sut = new ToggleInvoicePaymentUseCase(repo)
  })

  it('should mark invoice as paid', async () => {
    const invoice = await repo.create({
      measurementBulletinId: 'bulletin-01',
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
      is_paid: false,
      status: 'PENDING',
    })

    const result = await sut.execute(invoice.id)

    expect(result.invoice.is_paid).toBe(true)
    expect(result.invoice.status).toBe('PAID')
    expect(result.invoice.payment_date).toBeDefined()
  })

  it('should mark invoice as unpaid (toggle back)', async () => {
    const invoice = await repo.create({
      measurementBulletinId: 'bulletin-01',
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
      is_paid: true,
      status: 'PAID',
    })

    const result = await sut.execute(invoice.id)

    expect(result.invoice.is_paid).toBe(false)
    expect(result.invoice.status).toBe('PENDING')
    expect(result.invoice.payment_date).toBeNull()
  })

  it('should throw when invoice does not exist', async () => {
    await expect(
      sut.execute('non-existent'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
