import { MaintenanceDocument } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { MaintenanceDocumentNotFoundError } from '../errors/maintenance-document-not-found-error'

interface GetMaintenanceDocumentByIdRequest {
  id: string
}

interface GetMaintenanceDocumentByIdResponse {
  document: MaintenanceDocument
}

export class GetMaintenanceDocumentByIdUseCase {
  constructor(private maintenanceDocumentRepository: IMaintenanceDocumentRepository) {}

  async execute({ id }: GetMaintenanceDocumentByIdRequest): Promise<GetMaintenanceDocumentByIdResponse> {
    const document = await this.maintenanceDocumentRepository.findById(id)

    if (!document) {
      throw new MaintenanceDocumentNotFoundError()
    }

    return { document }
  }
}
