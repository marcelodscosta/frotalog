import { MaintenanceDocument } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { MaintenanceDocumentNotFoundError } from '../errors/maintenance-document-not-found-error'

interface UpdateMaintenanceDocumentUseCaseRequest {
  id: string
  original_name?: string
  description?: string
}

interface UpdateMaintenanceDocumentUseCaseResponse {
  document: MaintenanceDocument
}

export class UpdateMaintenanceDocumentUseCase {
  constructor(
    private maintenanceDocumentRepository: IMaintenanceDocumentRepository,
  ) {}

  async execute({
    id,
    original_name,
    description,
  }: UpdateMaintenanceDocumentUseCaseRequest): Promise<UpdateMaintenanceDocumentUseCaseResponse> {
    const document = await this.maintenanceDocumentRepository.findById(id)

    if (!document) {
      throw new MaintenanceDocumentNotFoundError()
    }

    const updatedDocument =
      await this.maintenanceDocumentRepository.updateDocument(id, {
        original_name,
        description,
      })

    return {
      document: updatedDocument,
    }
  }
}
