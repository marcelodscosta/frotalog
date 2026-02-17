import { Invoice } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class GetInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<{ invoice: Invoice }> {
    const invoice = await this.invoiceRepository.findByIdWithDetails(id)
    if (!invoice) throw new ResourceNotFoundError()
    return { invoice }
  }
}
