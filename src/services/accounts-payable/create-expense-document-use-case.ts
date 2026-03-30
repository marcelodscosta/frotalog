import { ExpenseDocument } from '../../generated/prisma'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CreateExpenseDocumentUseCaseRequest {
  payableExpenseId: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  document_type?: string
  description?: string
}

interface CreateExpenseDocumentUseCaseResponse {
  document: ExpenseDocument
}

export class CreateExpenseDocumentUseCase {
  constructor(private payableExpenseRepository: IPayableExpenseRepository) {}

  async execute({
    payableExpenseId,
    filename,
    original_name,
    file_path,
    file_size,
    mime_type,
    document_type,
    description,
  }: CreateExpenseDocumentUseCaseRequest): Promise<CreateExpenseDocumentUseCaseResponse> {
    const expense = await this.payableExpenseRepository.findById(payableExpenseId)

    if (!expense) {
      throw new ResourceNotFoundError()
    }

    const document = await this.payableExpenseRepository.createDocument({
      payableExpenseId,
      filename,
      original_name,
      file_path,
      file_size,
      mime_type,
      document_type,
      description,
    })

    return {
      document,
    }
  }
}
