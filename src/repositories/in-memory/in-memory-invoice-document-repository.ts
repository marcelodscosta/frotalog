import { InvoiceDocument, Prisma } from '../../generated/prisma'
import { IInvoiceDocumentRepository } from '../interfaces/IInvoiceDocumentRepository'
import { randomUUID } from 'crypto'

export class InMemoryInvoiceDocumentRepository implements IInvoiceDocumentRepository {
  public items: InvoiceDocument[] = []

  async create(data: Prisma.InvoiceDocumentUncheckedCreateInput): Promise<InvoiceDocument> {
    const document = {
      id: data.id ?? randomUUID(),
      invoiceId: data.invoiceId,
      filename: data.filename,
      original_name: data.original_name,
      file_path: data.file_path,
      file_size: data.file_size,
      mime_type: data.mime_type,
      document_type: data.document_type ?? null,
      description: data.description ?? null,
      created_at: new Date(),
    }
    
    this.items.push(document)
    return document
  }

  async findById(id: string): Promise<InvoiceDocument | null> {
    const document = this.items.find(item => item.id === id)
    if (!document) return null
    return document
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceDocument[]> {
    return this.items.filter(item => item.invoiceId === invoiceId)
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1)
    }
  }
}
