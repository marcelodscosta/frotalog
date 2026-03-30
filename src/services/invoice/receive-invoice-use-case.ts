import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
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

    if (invoice.is_paid || invoice.status === 'PAID') {
      throw new Error('Invoice is already paid')
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
