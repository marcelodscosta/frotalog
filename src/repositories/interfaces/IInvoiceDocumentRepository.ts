import { InvoiceDocument, Prisma } from '../../generated/prisma'

export interface IInvoiceDocumentRepository {
  create(data: Prisma.InvoiceDocumentUncheckedCreateInput): Promise<InvoiceDocument>
  findById(id: string): Promise<InvoiceDocument | null>
  findByInvoiceId(invoiceId: string): Promise<InvoiceDocument[]>
  delete(id: string): Promise<void>
}
