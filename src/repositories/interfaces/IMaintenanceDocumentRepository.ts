import { MaintenanceDocument, Prisma } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IMaintenanceDocumentRepository {
  create(data: Prisma.MaintenanceDocumentCreateInput): Promise<MaintenanceDocument>
  updateDocument(id: string, data: Prisma.MaintenanceDocumentUpdateInput): Promise<MaintenanceDocument>
  
  findById(id: string): Promise<MaintenanceDocument | null>
  findByMaintenanceId(maintenanceId: string, page: number): Promise<PaginatedResult<MaintenanceDocument>>
  findByFilename(filename: string): Promise<MaintenanceDocument | null>
  
  findAll(page: number): Promise<PaginatedResult<MaintenanceDocument>>
  findByMimeType(mimeType: string, page: number): Promise<PaginatedResult<MaintenanceDocument>>
  
  deleteDocument(id: string): Promise<void>
  deactivateDocument(id: string): Promise<MaintenanceDocument>
  activateDocument(id: string): Promise<MaintenanceDocument>
}
