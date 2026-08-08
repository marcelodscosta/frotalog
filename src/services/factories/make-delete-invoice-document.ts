import { PrismaInvoiceDocumentRepository } from '../../repositories/prisma/prisma-invoice-document-repository'
import { DeleteInvoiceDocumentUseCase } from '../invoice-document/delete-invoice-document-use-case'

export function makeDeleteInvoiceDocument() {
  const invoiceDocumentRepository = new PrismaInvoiceDocumentRepository()
  const useCase = new DeleteInvoiceDocumentUseCase(invoiceDocumentRepository)
  return useCase
}
