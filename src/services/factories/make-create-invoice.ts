import { PrismaInvoiceRepository } from '../../repositories/prisma/prisma-invoice-repository'
import { PrismaMeasurementBulletinRepository } from '../../repositories/prisma/prisma-measurement-bulletin-repository'
import { CreateInvoiceUseCase } from '../invoice/create-invoice-use-case'

export function makeCreateInvoice() {
  return new CreateInvoiceUseCase(
    new PrismaInvoiceRepository(),
    new PrismaMeasurementBulletinRepository(),
  )
}
