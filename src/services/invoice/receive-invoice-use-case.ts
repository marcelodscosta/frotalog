import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { AppError } from '../errors/app-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ReceiveInvoiceUseCaseRequest {
  invoiceId: string
  bankAccountId: string
  chartOfAccountId?: string
  payment_date: Date
}

export class ReceiveInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute({
    invoiceId,
    bankAccountId,
    chartOfAccountId,
    payment_date,
  }: ReceiveInvoiceUseCaseRequest) {
    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new ResourceNotFoundError()
    }

    if (!invoice.is_active || invoice.status === 'CANCELLED') {
      throw new AppError('Fatura cancelada não pode ser recebida.', 400)
    }

    if (invoice.is_paid || invoice.status === 'PAID') {
      throw new AppError('Fatura já foi recebida.', 400)
    }

    const updatedInvoice = await this.invoiceRepository.receive(invoiceId, {
      amount: Number(invoice.total_value),
      bankAccountId,
      chartOfAccountId,
      payment_date,
    })

    return { invoice: updatedInvoice }
  }
}
