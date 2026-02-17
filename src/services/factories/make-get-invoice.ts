import { PrismaInvoiceRepository } from '../../repositories/prisma/prisma-invoice-repository'
import { GetInvoiceUseCase } from '../invoice/get-invoice-use-case'

export function makeGetInvoice() {
  return new GetInvoiceUseCase(new PrismaInvoiceRepository())
}
