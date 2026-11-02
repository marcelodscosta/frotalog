import { describe, it, expect, beforeEach } from 'vitest'
import { RefundInvoiceUseCase } from '../../invoice/refund-invoice-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { AppError } from '../../errors/app-error'

let repo: InMemoryInvoiceRepository
let sut: RefundInvoiceUseCase

describe('Refund Invoice', () => {
  beforeEach(() => {
    repo = new InMemoryInvoiceRepository()
    sut = new RefundInvoiceUseCase(repo)
  })

  it('should revert a received invoice to pending', async () => {
    const invoice = await repo.create({
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
      is_paid: true,
      status: 'PAID',
      payment_date: new Date('2026-02-10'),
    })

    const result = await sut.execute(invoice.id)

    expect(result.invoice.is_paid).toBe(false)
    expect(result.invoice.status).toBe('PENDING')
    expect(result.invoice.payment_date).toBeNull()
  })

  it('should throw when invoice is not received', async () => {
    const invoice = await repo.create({
      invoice_number: 'FAT-000002',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
      is_paid: false,
      status: 'PENDING',
    })

    await expect(sut.execute(invoice.id)).rejects.toBeInstanceOf(AppError)
  })

  it('should throw when invoice does not exist', async () => {
    await expect(sut.execute('non-existent')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
