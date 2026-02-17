import { Invoice } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class ToggleInvoicePaymentUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<{ invoice: Invoice }> {
    const existing = await this.invoiceRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    const isPaid = !existing.is_paid
    const invoice = await this.invoiceRepository.update(id, {
      is_paid: isPaid,
      payment_date: isPaid ? new Date() : null,
      status: isPaid ? 'PAID' : 'PENDING',
    })

    return { invoice }
  }
}
