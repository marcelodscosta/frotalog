import { MaintenanceDocument } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface GetMaintenanceDocumentsByMaintenanceRequest {
  maintenanceId: string
  page: number
}

interface GetMaintenanceDocumentsByMaintenanceResponse {
  documents: PaginatedResult<MaintenanceDocument>
}

export class GetMaintenanceDocumentsByMaintenanceUseCase {
  constructor(private maintenanceDocumentRepository: IMaintenanceDocumentRepository) {}

  async execute({ maintenanceId, page }: GetMaintenanceDocumentsByMaintenanceRequest): Promise<GetMaintenanceDocumentsByMaintenanceResponse> {
    const documents = await this.maintenanceDocumentRepository.findByMaintenanceId(maintenanceId, page)
    return { documents }
  }
}
