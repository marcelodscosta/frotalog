import { Prisma, InvoiceDocument } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IInvoiceDocumentRepository } from '../interfaces/IInvoiceDocumentRepository'

export class PrismaInvoiceDocumentRepository implements IInvoiceDocumentRepository {
  async create(data: Prisma.InvoiceDocumentUncheckedCreateInput): Promise<InvoiceDocument> {
    const document = await prisma.invoiceDocument.create({ data })
    return document
  }

  async findById(id: string): Promise<InvoiceDocument | null> {
    const document = await prisma.invoiceDocument.findUnique({
      where: { id },
    })
    return document
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceDocument[]> {
    const documents = await prisma.invoiceDocument.findMany({
      where: { invoiceId },
    })
    return documents
  }

  async delete(id: string): Promise<void> {
    await prisma.invoiceDocument.delete({
      where: { id },
    })
  }
}
