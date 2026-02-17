import { PrismaInvoiceRepository } from '../../repositories/prisma/prisma-invoice-repository'
import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { DeleteInvoiceUseCase } from '../invoice/delete-invoice-use-case'

export function makeDeleteInvoice() {
  return new DeleteInvoiceUseCase(
    new PrismaInvoiceRepository(),
    new PrismaMeasurementBulletinRepository(),
  )
}
