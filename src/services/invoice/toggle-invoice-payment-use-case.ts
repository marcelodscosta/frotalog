import { Invoice } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { AppError } from '../errors/app-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

/**
 * Ações de pagamento passam sempre pelo recebimento com conta bancária.
 * O toggle permanece apenas como atalho de estorno de faturas já recebidas.
 */
export class ToggleInvoicePaymentUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<{ invoice: Invoice }> {
    const existing = await this.invoiceRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    if (!existing.is_paid) {
      throw new AppError(
        'Para marcar a fatura como paga, registre o recebimento informando a conta bancária.',
        400,
      )
    }

    const invoice = await this.invoiceRepository.refund(id)

    return { invoice }
  }
}
