import { Invoice, InvoiceStatus } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchInvoicesRequest {
  status?: InvoiceStatus
  page: number
}

interface FetchInvoicesResponse {
  invoices: PaginatedResult<Invoice>
}

export class FetchInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute({
    status,
    page,
  }: FetchInvoicesRequest): Promise<FetchInvoicesResponse> {
    const invoices = status
      ? await this.invoiceRepository.findByStatus(status, page)
      : await this.invoiceRepository.findAll(page)

    return { invoices }
  }
}
