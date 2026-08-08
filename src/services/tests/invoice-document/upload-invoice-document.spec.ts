import { describe, it, expect, beforeEach } from 'vitest'
import { UploadInvoiceDocumentUseCase } from '../../invoice-document/upload-invoice-document-use-case'
import { InMemoryInvoiceDocumentRepository } from '../../../repositories/in-memory/in-memory-invoice-document-repository'
import { InMemoryInvoiceRepository } from '../../../repositories/in-memory/in-memory-invoice-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let invoiceDocumentRepository: InMemoryInvoiceDocumentRepository
let invoiceRepository: InMemoryInvoiceRepository
let sut: UploadInvoiceDocumentUseCase

describe('Upload Invoice Document Use Case', () => {
  beforeEach(() => {
    invoiceDocumentRepository = new InMemoryInvoiceDocumentRepository()
    invoiceRepository = new InMemoryInvoiceRepository()
    sut = new UploadInvoiceDocumentUseCase(invoiceDocumentRepository, invoiceRepository)
  })

  it('should be able to upload a document for an invoice', async () => {
    await invoiceRepository.create({
      id: 'invoice-01',
      total_value: 1000,
      due_date: new Date(),
    })

    const { document } = await sut.execute({
      invoiceId: 'invoice-01',
      filename: 'test-file.pdf',
      original_name: 'test-file.pdf',
      file_path: 'https://b2.com/test-file.pdf',
      file_size: 1024,
      mime_type: 'application/pdf',
      document_type: 'BOLETO',
      description: 'Test description',
    })

    expect(document.id).toEqual(expect.any(String))
    expect(document.invoiceId).toEqual('invoice-01')
    expect(document.filename).toEqual('test-file.pdf')
    expect(invoiceDocumentRepository.items).toHaveLength(1)
  })

  it('should not be able to upload a document for a non-existing invoice', async () => {
    await expect(() =>
      sut.execute({
        invoiceId: 'invalid-invoice',
        filename: 'test-file.pdf',
        original_name: 'test-file.pdf',
        file_path: 'https://b2.com/test-file.pdf',
        file_size: 1024,
        mime_type: 'application/pdf',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
