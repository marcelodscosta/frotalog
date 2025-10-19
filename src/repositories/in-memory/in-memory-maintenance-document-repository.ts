import { MaintenanceDocument, Prisma } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../interfaces/IMaintenanceDocumentRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryMaintenanceDocumentRepository
  implements IMaintenanceDocumentRepository
{
  public documents: MaintenanceDocument[] = []

  async create(
    data: Prisma.MaintenanceDocumentCreateInput,
  ): Promise<MaintenanceDocument> {
    const document: MaintenanceDocument = {
      id: crypto.randomUUID(),
      filename: data.filename,
      original_name: data.original_name,
      file_path: data.file_path,
      file_size: data.file_size,
      mime_type: data.mime_type,
      description: data.description || null,
      created_at: new Date(),
      maintenanceId: data.Maintenance?.connect?.id || null,
      // @ts-expect-error - This will be populated by includes
      Maintenance: null,
    }

    this.documents.push(document)
    return document
  }

  async updateDocument(
    id: string,
    data: Prisma.MaintenanceDocumentUpdateInput,
  ): Promise<MaintenanceDocument> {
    const documentIndex = this.documents.findIndex(
      (document) => document.id === id,
    )

    if (documentIndex === -1) {
      throw new Error('Document not found')
    }

    const document = this.documents[documentIndex]
    const updatedDocument = {
      ...document,
      ...data,
    }

    this.documents[documentIndex] = updatedDocument as MaintenanceDocument
    return updatedDocument as MaintenanceDocument
  }

  async findById(id: string): Promise<MaintenanceDocument | null> {
    const document = this.documents.find((document) => document.id === id)
    return document || null
  }

  async findByMaintenanceId(
    maintenanceId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceDocument>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const documentsByMaintenance = this.documents.filter(
      (document) => document.maintenanceId === maintenanceId,
    )
    const totalCount = documentsByMaintenance.length

    const documents = documentsByMaintenance
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: documents,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByFilename(filename: string): Promise<MaintenanceDocument | null> {
    const document = this.documents.find(
      (document) => document.filename === filename,
    )
    return document || null
  }

  async findAll(page: number): Promise<PaginatedResult<MaintenanceDocument>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const totalCount = this.documents.length

    const documents = this.documents
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: documents,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByMimeType(
    mimeType: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceDocument>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const documentsByMimeType = this.documents.filter(
      (document) => document.mime_type === mimeType,
    )
    const totalCount = documentsByMimeType.length

    const documents = documentsByMimeType
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + PAGE_SIZE)

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: documents,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async deleteDocument(id: string): Promise<void> {
    const documentIndex = this.documents.findIndex(
      (document) => document.id === id,
    )

    if (documentIndex === -1) {
      throw new Error('Document not found')
    }

    this.documents.splice(documentIndex, 1)
  }

  async deactivateDocument(id: string): Promise<MaintenanceDocument> {
    const documentIndex = this.documents.findIndex(
      (document) => document.id === id,
    )

    if (documentIndex === -1) {
      throw new Error('Document not found')
    }

    const document = this.documents[documentIndex]
    this.documents.splice(documentIndex, 1)
    return document
  }

  async activateDocument(id: string): Promise<MaintenanceDocument> {
    const document = this.documents.find((document) => document.id === id)

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  }
}
