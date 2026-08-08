import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteInvoiceDocumentUseCase } from '../../invoice-document/delete-invoice-document-use-case'
import { InMemoryInvoiceDocumentRepository } from '../../../repositories/in-memory/in-memory-invoice-document-repository'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'

let invoiceDocumentRepository: InMemoryInvoiceDocumentRepository
let sut: DeleteInvoiceDocumentUseCase

describe('Delete Invoice Document Use Case', () => {
  beforeEach(() => {
    invoiceDocumentRepository = new InMemoryInvoiceDocumentRepository()
    sut = new DeleteInvoiceDocumentUseCase(invoiceDocumentRepository)
  })

  it('should be able to delete a document', async () => {
    await invoiceDocumentRepository.create({
      id: 'doc-01',
      invoiceId: 'invoice-01',
      filename: 'test.pdf',
      original_name: 'test.pdf',
      file_path: 'url',
      file_size: 100,
      mime_type: 'application/pdf',
    })

    await sut.execute({ documentId: 'doc-01' })

    expect(invoiceDocumentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existing document', async () => {
    await expect(() =>
      sut.execute({ documentId: 'invalid-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
