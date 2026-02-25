import { describe, it, expect, beforeEach } from 'vitest'
import { FetchInvoicesUseCase } from '../../invoice/fetch-invoices-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'

let repo: InMemoryInvoiceRepository
let sut: FetchInvoicesUseCase

describe('Fetch Invoices', () => {
  beforeEach(async () => {
    repo = new InMemoryInvoiceRepository()
    sut = new FetchInvoicesUseCase(repo)

    await repo.create({
      measurementBulletinId: 'bulletin-01',
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-01-01'),
      due_date: new Date('2026-02-01'),
      total_value: 15000,
      status: 'PENDING',
    })

    await repo.create({
      measurementBulletinId: 'bulletin-02',
      invoice_number: 'FAT-000002',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 5000,
      status: 'PAID',
    })
  })

  it('should fetch all invoices paginated', async () => {
    const result = await sut.execute({ page: 1 })

    expect(result.invoices.items).toHaveLength(2)
    expect(result.invoices.totalItems).toBe(2)
  })

  it('should filter by status', async () => {
    const result = await sut.execute({ status: 'PENDING', page: 1 })

    expect(result.invoices.items).toHaveLength(1)
    expect(result.invoices.items[0].status).toBe('PENDING')
  })

  it('should return empty when no invoices match', async () => {
    const result = await sut.execute({
      status: 'CANCELLED',
      page: 1,
    })

    expect(result.invoices.items).toHaveLength(0)
  })
})
