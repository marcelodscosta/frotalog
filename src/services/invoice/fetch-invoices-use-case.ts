import { Invoice, InvoiceStatus } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchInvoicesRequest {
  status?: InvoiceStatus
  contractId?: string
  assetId?: string
  page: number
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
  }: FetchInvoicesRequest): Promise<FetchInvoicesResponse> {
    const invoices = await this.invoiceRepository.findMany({
      page,
      status,
      contractId,
      assetId,
    })

    return { invoices }
  }
}
