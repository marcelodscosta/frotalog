import { Invoice, InvoiceStatus } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchInvoicesRequest {
  status?: InvoiceStatus
  contractId?: string
  assetId?: string
  page: number
  month?: number
  year?: number
  search?: string
}

interface FetchInvoicesResponse {
  invoices: PaginatedResult<Invoice>
}

export class FetchInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute({
    status,
    contractId,
    assetId,
    page,
    month,
    year,
    search,
  }: FetchInvoicesRequest): Promise<FetchInvoicesResponse> {
    const invoices = await this.invoiceRepository.findMany({
      page,
      status,
      contractId,
      assetId,
      month,
      year,
      search,
    })

    return { invoices }
  }
}
