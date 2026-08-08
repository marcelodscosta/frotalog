import { PrismaInvoiceDocumentRepository } from '../../repositories/prisma/prisma-invoice-document-repository'
import { PrismaInvoiceRepository } from '../../repositories/prisma/prisma-invoice-repository'
import { UploadInvoiceDocumentUseCase } from '../invoice-document/upload-invoice-document-use-case'

export function makeUploadInvoiceDocument() {
  const invoiceDocumentRepository = new PrismaInvoiceDocumentRepository()
  const invoiceRepository = new PrismaInvoiceRepository()
  const useCase = new UploadInvoiceDocumentUseCase(invoiceDocumentRepository, invoiceRepository)
  return useCase
}
