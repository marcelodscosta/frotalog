import { MaintenanceDocument } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface GetMaintenanceDocumentsByMaintenanceRequest {
  maintenanceId: string
  page: number
}

interface GetMaintenanceDocumentsByMaintenanceResponse {
  documents: PaginatedResult<MaintenanceDocument>
}

export class GetMaintenanceDocumentsByMaintenanceUseCase {
  constructor(
    private maintenanceDocumentRepository: IMaintenanceDocumentRepository,
    private payableExpenseRepository: IPayableExpenseRepository,
  ) {}

  async execute({ maintenanceId, page }: GetMaintenanceDocumentsByMaintenanceRequest): Promise<GetMaintenanceDocumentsByMaintenanceResponse> {
    const maintenanceDocs = await this.maintenanceDocumentRepository.findByMaintenanceId(maintenanceId, page)
    const expenseDocs = await this.payableExpenseRepository.findDocumentsByMaintenanceId(maintenanceId)

    // Map expense documents to look like maintenance documents for the frontend
    const mappedExpenseDocs: MaintenanceDocument[] = expenseDocs.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      original_name: doc.original_name,
      file_path: doc.file_path,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      description: doc.description || doc.document_type || null,
      created_at: doc.created_at,
      maintenanceId, // Link to the current maintenance for consistency
    }))

    // For now, we append the expense docs to the maintenance docs.
    // Since expense documents are usually fewer, we just add them to the paginated result.
    // In a more complex scenario, we would need a unified paginated repository method.
    return {
      documents: {
        ...maintenanceDocs,
        items: [...maintenanceDocs.items, ...mappedExpenseDocs],
        totalItems: maintenanceDocs.totalItems + mappedExpenseDocs.length,
      }
    }
  }
}
