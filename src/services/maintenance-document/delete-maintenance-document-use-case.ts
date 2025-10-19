import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { MaintenanceDocumentNotFoundError } from '../errors/maintenance-document-not-found-error'

interface DeleteMaintenanceDocumentRequest {
  id: string
}

export class DeleteMaintenanceDocumentUseCase {
  constructor(private maintenanceDocumentRepository: IMaintenanceDocumentRepository) {}

  async execute({ id }: DeleteMaintenanceDocumentRequest): Promise<void> {
    const document = await this.maintenanceDocumentRepository.findById(id)

    if (!document) {
      throw new MaintenanceDocumentNotFoundError()
    }

    await this.maintenanceDocumentRepository.deleteDocument(id)
  }
}
