import { IInvoiceDocumentRepository } from '../../repositories/interfaces/IInvoiceDocumentRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteInvoiceDocumentUseCaseRequest {
  documentId: string
}

export class DeleteInvoiceDocumentUseCase {
  constructor(
    private invoiceDocumentRepository: IInvoiceDocumentRepository
  ) {}

  async execute({ documentId }: DeleteInvoiceDocumentUseCaseRequest): Promise<void> {
    const document = await this.invoiceDocumentRepository.findById(documentId)

    if (!document) {
      throw new ResourceNotFoundError()
    }

    await this.invoiceDocumentRepository.delete(documentId)
  }
}
