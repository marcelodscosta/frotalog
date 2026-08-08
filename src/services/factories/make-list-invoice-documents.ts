import { PrismaInvoiceDocumentRepository } from '../../repositories/prisma/prisma-invoice-document-repository'
import { ListInvoiceDocumentsUseCase } from '../invoice-document/list-invoice-documents-use-case'

export function makeListInvoiceDocuments() {
  const invoiceDocumentRepository = new PrismaInvoiceDocumentRepository()
  const useCase = new ListInvoiceDocumentsUseCase(invoiceDocumentRepository)
  return useCase
}
