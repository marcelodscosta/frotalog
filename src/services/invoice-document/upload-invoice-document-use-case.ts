import { InvoiceDocument } from '../../generated/prisma'
import { IInvoiceDocumentRepository } from '../../repositories/interfaces/IInvoiceDocumentRepository'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UploadInvoiceDocumentUseCaseRequest {
  invoiceId: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  document_type?: string
  description?: string
}

interface UploadInvoiceDocumentUseCaseResponse {
  document: InvoiceDocument
}

export class UploadInvoiceDocumentUseCase {
  constructor(
    private invoiceDocumentRepository: IInvoiceDocumentRepository,
    private invoiceRepository: IInvoiceRepository
  ) {}

  async execute({
    invoiceId,
    filename,
    original_name,
    file_path,
    file_size,
    mime_type,
    document_type,
    description,
  }: UploadInvoiceDocumentUseCaseRequest): Promise<UploadInvoiceDocumentUseCaseResponse> {
    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new ResourceNotFoundError()
    }

    const document = await this.invoiceDocumentRepository.create({
      invoiceId,
      filename,
      original_name,
      file_path,
      file_size,
      mime_type,
      document_type,
      description,
    })

    return { document }
  }
}
