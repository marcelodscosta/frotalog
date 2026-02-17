import { PrismaInvoiceRepository } from '../../repositories/prisma/prisma-invoice-repository'
import { FetchInvoicesUseCase } from '../invoice/fetch-invoices-use-case'

export function makeFetchInvoices() {
  return new FetchInvoicesUseCase(new PrismaInvoiceRepository())
}
