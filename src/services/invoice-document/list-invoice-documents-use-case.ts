import { InvoiceDocument } from '../../generated/prisma'
import { IInvoiceDocumentRepository } from '../../repositories/interfaces/IInvoiceDocumentRepository'

interface ListInvoiceDocumentsUseCaseRequest {
  invoiceId: string
}

interface ListInvoiceDocumentsUseCaseResponse {
  documents: InvoiceDocument[]
}

export class ListInvoiceDocumentsUseCase {
  constructor(private invoiceDocumentRepository: IInvoiceDocumentRepository) {}

  async execute({
    invoiceId,
  }: ListInvoiceDocumentsUseCaseRequest): Promise<ListInvoiceDocumentsUseCaseResponse> {
    const documents = await this.invoiceDocumentRepository.findByInvoiceId(invoiceId)
    return { documents }
  }
}
