import { describe, it, expect, beforeEach } from 'vitest'
import { ListInvoiceDocumentsUseCase } from '../../invoice-document/list-invoice-documents-use-case'
import { InMemoryInvoiceDocumentRepository } from '../../../repositories/in-memory/in-memory-invoice-document-repository'

let invoiceDocumentRepository: InMemoryInvoiceDocumentRepository
let sut: ListInvoiceDocumentsUseCase

describe('List Invoice Documents Use Case', () => {
  beforeEach(() => {
    invoiceDocumentRepository = new InMemoryInvoiceDocumentRepository()
    sut = new ListInvoiceDocumentsUseCase(invoiceDocumentRepository)
  })

  it('should be able to list documents of an invoice', async () => {
    await invoiceDocumentRepository.create({
      id: 'doc-01',
      invoiceId: 'invoice-01',
      filename: 'doc1.pdf',
      original_name: 'doc1.pdf',
      file_path: 'url1',
      file_size: 100,
      mime_type: 'application/pdf',
    })

    await invoiceDocumentRepository.create({
      id: 'doc-02',
      invoiceId: 'invoice-01',
      filename: 'doc2.pdf',
      original_name: 'doc2.pdf',
      file_path: 'url2',
      file_size: 200,
      mime_type: 'application/pdf',
    })

    await invoiceDocumentRepository.create({
      id: 'doc-03',
      invoiceId: 'invoice-02',
      filename: 'doc3.pdf',
      original_name: 'doc3.pdf',
      file_path: 'url3',
      file_size: 300,
      mime_type: 'application/pdf',
    })

    const { documents } = await sut.execute({ invoiceId: 'invoice-01' })

    expect(documents).toHaveLength(2)
    expect(documents).toEqual([
      expect.objectContaining({ filename: 'doc1.pdf' }),
      expect.objectContaining({ filename: 'doc2.pdf' }),
    ])
  })
})
