import { Prisma, MaintenanceDocument } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IMaintenanceDocumentRepository } from '../interfaces/IMaintenanceDocumentRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaMaintenanceDocumentRepository
  implements IMaintenanceDocumentRepository
{
  async create(
    data: Prisma.MaintenanceDocumentCreateInput,
  ): Promise<MaintenanceDocument> {
    const document = await prisma.maintenanceDocument.create({
      data: {
        ...data,
        Maintenance: data.Maintenance
          ? { connect: { id: data.Maintenance.connect?.id } }
          : undefined,
      },
    })
    return document
  }

  async updateDocument(
    id: string,
    data: Prisma.MaintenanceDocumentUpdateInput,
  ): Promise<MaintenanceDocument> {
    const updateDocument = await prisma.maintenanceDocument.update({
      where: { id },
      data,
    })
    return updateDocument
  }

  async findById(id: string): Promise<MaintenanceDocument | null> {
    const document = await prisma.maintenanceDocument.findUnique({
      where: { id },
      include: {
        Maintenance: true,
      },
    })
    return document
  }

  async findByMaintenanceId(
    maintenanceId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceDocument>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [documents, totalCount] = await prisma.$transaction([
      prisma.maintenanceDocument.findMany({
        where: {
          maintenanceId,
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          Maintenance: true,
        },
      }),
      prisma.maintenanceDocument.count({
        where: {
          maintenanceId,
        },
      }),
    ])

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
    const document = await prisma.maintenanceDocument.findFirst({
      where: { filename },
      include: {
        Maintenance: true,
      },
    })
    return document
  }

  async findAll(page: number): Promise<PaginatedResult<MaintenanceDocument>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [documents, totalCount] = await prisma.$transaction([
      prisma.maintenanceDocument.findMany({
        skip,
        take: PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          Maintenance: true,
        },
      }),
      prisma.maintenanceDocument.count(),
    ])

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

    const [documents, totalCount] = await prisma.$transaction([
      prisma.maintenanceDocument.findMany({
        where: {
          mime_type: mimeType,
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          Maintenance: true,
        },
      }),
      prisma.maintenanceDocument.count({
        where: {
          mime_type: mimeType,
        },
      }),
    ])

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
    await prisma.maintenanceDocument.delete({
      where: { id },
    })
  }

  async deactivateDocument(id: string): Promise<MaintenanceDocument> {
    // Como MaintenanceDocument não tem campo is_Active, vamos usar uma abordagem diferente
    // Podemos adicionar um campo soft delete ou simplesmente deletar
    // Por enquanto, vou implementar como delete permanente
    const document = await prisma.maintenanceDocument.findUnique({
      where: { id },
    })

    if (!document) {
      throw new Error('Document not found')
    }

    await prisma.maintenanceDocument.delete({
      where: { id },
    })

    return document
  }

  async activateDocument(id: string): Promise<MaintenanceDocument> {
    // Como não há campo is_Active, retornamos o documento se existir
    const document = await prisma.maintenanceDocument.findUnique({
      where: { id },
    })

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  }
}
