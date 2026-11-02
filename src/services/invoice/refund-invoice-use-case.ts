import { Invoice } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { AppError } from '../errors/app-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class RefundInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<{ invoice: Invoice }> {
    const existing = await this.invoiceRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    if (!existing.is_paid) {
      throw new AppError('A fatura não está recebida.', 400)
    }

    const invoice = await this.invoiceRepository.refund(id)

    return { invoice }
  }
}
