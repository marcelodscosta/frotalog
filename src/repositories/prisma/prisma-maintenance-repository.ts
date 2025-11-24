import { Prisma, Maintenance } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IMaintenanceRepository } from '../interfaces/IMaintenanceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaMaintenanceRepository implements IMaintenanceRepository {
  async create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance> {
    const maintenance = await prisma.maintenance.create({ 
      data: {
        ...data,
        asset: { connect: { id: data.asset.connect?.id } },
        supplier: { connect: { id: data.supplier.connect?.id } },
      }
    })
    return maintenance
  }

  async updateMaintenance(id: string, data: Prisma.MaintenanceUpdateInput): Promise<Maintenance> {
    const updateMaintenance = await prisma.maintenance.update({
      where: { id },
      data,
    })
    return updateMaintenance
  }

  async findById(id: string): Promise<Maintenance | null> {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        asset: {
          include: {
            assetCategory: true,
          },
        },
        supplier: true,
        documents: true,
      },
    })
    return maintenance
  }

  async findByAssetId(assetId: string, page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { 
          is_Active: true,
          assetId 
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'desc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { 
          is_Active: true,
          assetId 
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findBySupplierId(supplierId: string, page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { 
          is_Active: true,
          supplierId 
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'desc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { 
          is_Active: true,
          supplierId 
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByStatus(status: Prisma.MaintenanceStatus, page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { 
          is_Active: true,
          status 
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'desc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { 
          is_Active: true,
          status 
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByType(type: Prisma.MaintenanceType, page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { 
          is_Active: true,
          type 
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'desc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { 
          is_Active: true,
          type 
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAll(page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { is_Active: true },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'desc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { is_Active: true },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findScheduledMaintenances(page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const now = new Date()

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { 
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { gte: now }
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'asc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { 
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { gte: now }
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findOverdueMaintenances(page: number): Promise<PaginatedResult<Maintenance>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const now = new Date()

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: { 
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { lt: now }
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'asc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
            },
          },
          supplier: true,
        },
      }),
      prisma.maintenance.count({
        where: { 
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { lt: now }
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: maintenances,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async updateStatus(id: string, status: Prisma.MaintenanceStatus): Promise<Maintenance> {
    const updateData: Prisma.MaintenanceUpdateInput = { status }

    if (status === 'IN_PROGRESS') {
      updateData.started_date = new Date()
    } else if (status === 'COMPLETED') {
      updateData.completed_date = new Date()
    }

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
    })
    return maintenance
  }

  async updateCosts(id: string, estimatedCost?: number, actualCost?: number): Promise<Maintenance> {
    const updateData: Prisma.MaintenanceUpdateInput = {}

    if (estimatedCost !== undefined) {
      updateData.estimated_cost = estimatedCost
    }
    if (actualCost !== undefined) {
      updateData.actual_cost = actualCost
    }

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
    })
    return maintenance
  }

  async deactivateMaintenance(id: string): Promise<Maintenance> {
    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: { is_Active: false },
    })
    return maintenance
  }

  async activateMaintenance(id: string): Promise<Maintenance> {
    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: { is_Active: true },
    })
    return maintenance
  }
}
