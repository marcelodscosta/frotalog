import { MaintenanceDocument } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FindAllMaintenanceDocumentRequest {
  page: number
}

interface FindAllMaintenanceDocumentResponse {
  documents: PaginatedResult<MaintenanceDocument>
}

export class FindAllMaintenanceDocumentUseCase {
  constructor(private maintenanceDocumentRepository: IMaintenanceDocumentRepository) {}

  async execute({ page }: FindAllMaintenanceDocumentRequest): Promise<FindAllMaintenanceDocumentResponse> {
    const documents = await this.maintenanceDocumentRepository.findAll(page)
    return { documents }
  }
}
