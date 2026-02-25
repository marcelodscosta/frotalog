import { describe, it, expect, beforeEach } from 'vitest'
import { GetInvoiceUseCase } from '../../invoice/get-invoice-use-case'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let repo: InMemoryInvoiceRepository
let sut: GetInvoiceUseCase

describe('Get Invoice', () => {
  beforeEach(() => {
    repo = new InMemoryInvoiceRepository()
    sut = new GetInvoiceUseCase(repo)
  })

  it('should return an invoice by id', async () => {
    const created = await repo.create({
      measurementBulletinId: 'bulletin-01',
      invoice_number: 'FAT-000001',
      issue_date: new Date('2026-02-01'),
      due_date: new Date('2026-03-01'),
      total_value: 15000,
    })

    const result = await sut.execute(created.id)

    expect(result.invoice).toBeDefined()
    expect(result.invoice.id).toBe(created.id)
    expect(result.invoice.invoice_number).toBe('FAT-000001')
    expect(Number(result.invoice.total_value)).toBe(15000)
  })

  it('should throw when invoice is not found', async () => {
    await expect(
      sut.execute('non-existent'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
