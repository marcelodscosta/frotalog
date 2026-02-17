import { PrismaInvoiceRepository } from '../../repositories/prisma/prisma-invoice-repository'
import { ToggleInvoicePaymentUseCase } from '../invoice/toggle-invoice-payment-use-case'

export function makeToggleInvoicePayment() {
  return new ToggleInvoicePaymentUseCase(new PrismaInvoiceRepository())
}
