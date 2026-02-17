import {
  Prisma,
  Maintenance,
  Supplier,
  Asset,
  ServiceCategory,
} from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import {
  IMaintenanceRepository,
  MaintenanceWithRelations,
} from '../interfaces/IMaintenanceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

interface FindScheduledOnlyParams {
  startDate?: Date
  endDate?: Date
}

export class PrismaMaintenanceRepository implements IMaintenanceRepository {
  async create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance> {
    const maintenance = await prisma.maintenance.create({
      data: {
        ...data,
        asset: { connect: { id: data.asset.connect?.id } },
        supplier: data.supplier?.connect?.id 
            ? { connect: { id: data.supplier.connect.id } } 
            : undefined,
        serviceCategory: data.serviceCategory?.connect?.id
          ? { connect: { id: data.serviceCategory.connect.id } }
          : undefined,
      },
    })
    return maintenance
  }

  async updateMaintenance(
    id: string,
    data: Prisma.MaintenanceUpdateInput,
  ): Promise<Maintenance> {
    const inputData = data as any
    const updateData: Prisma.MaintenanceUpdateInput = {}

    Object.keys(data).forEach((key) => {
      if (
        key !== 'assetId' &&
        key !== 'supplierId' &&
        key !== 'serviceCategoryId'
      ) {
        ;(updateData as any)[key] = (data as any)[key]
      }
    })

    if (inputData.assetId) {
      updateData.asset = {
        connect: { id: inputData.assetId as string },
      }
    }

    if (inputData.supplierId) {
      updateData.supplier = {
        connect: { id: inputData.supplierId as string },
      }
    }

    if ('serviceCategoryId' in inputData) {
      if (inputData.serviceCategoryId === null) {
        updateData.serviceCategory = {
          disconnect: true,
        }
      } else if (inputData.serviceCategoryId) {
        updateData.serviceCategory = {
          connect: { id: inputData.serviceCategoryId as string },
        }
      }
    }

    const updateMaintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
      include: {
        asset: {
          include: {
            assetCategory: true,
          },
        },
        supplier: true,
        serviceCategory: true,
      },
    })

    return updateMaintenance
  }

  async findById(id: string): Promise<MaintenanceWithRelations | null> {
    const maintenance = await prisma.maintenance.findUnique({
      where: {
        id,
        is_Active: true,
        status: { not: 'CANCELLED' },
      },
      include: {
        asset: {
          include: {
            assetCategory: true,
          },
        },
        supplier: true,
        serviceCategory: true,
        documents: true,
      },
    })
    return maintenance
  }

  async findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          assetId,
          status: { not: 'CANCELLED' },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          assetId,
          status: { not: 'CANCELLED' },
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

  async findBySupplierId(
    supplierId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          supplierId,
          status: { not: 'CANCELLED' },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          supplierId,
          status: { not: 'CANCELLED' },
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

  async findByStatus(
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          status,
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          status,
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

  async findByType(
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY',
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          type,
          status: { not: 'CANCELLED' },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          type,
          status: { not: 'CANCELLED' },
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

  async findAll(
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          status: { not: 'CANCELLED' },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          status: { not: 'CANCELLED' },
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

  async findScheduledMaintenances(
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const now = new Date()

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { gte: now },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { gte: now },
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

  async findOverdueMaintenances(
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const now = new Date()

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { lt: now },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          status: 'SCHEDULED',
          scheduled_date: { lt: now },
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

  async updateStatus(
    id: string,
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ): Promise<Maintenance> {
    const updateData: Prisma.MaintenanceUpdateInput = { status }

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
    })
    return maintenance
  }

  async updateCosts(
    id: string,
    estimatedCost?: number,
    actualCost?: number,
  ): Promise<Maintenance> {
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

  async updateCompletedDate(id: string): Promise<Maintenance> {
    const updateMaintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        completed_date: null,
      },
    })
    return updateMaintenance
  }

  async findMaintenancesByAssetPeriod(
    assetId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<
      Maintenance & {
        supplier: Pick<Supplier, 'company_name'>
        asset: Pick<Asset, 'brand' | 'model' | 'plate' | 'year'>
        serviceCategory: Pick<ServiceCategory, 'name'> | null
      }
    >
  > {
    const maintenances = await prisma.maintenance.findMany({
      where: {
        is_Active: true,
        assetId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            started_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            scheduled_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            completed_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            AND: [
              {
                OR: [
                  { started_date: { lte: startDate } },
                  { scheduled_date: { lte: startDate } },
                ],
              },
              {
                OR: [
                  { completed_date: { gte: startDate } },
                  { completed_date: null },
                ],
              },
            ],
          },
        ],
      },
      include: {
        supplier: {
          select: {
            company_name: true,
            trading_name: true,
          },
        },
        asset: {
          select: {
            brand: true,
            model: true,
            plate: true,
            year: true,
            serial_number: true,
          },
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        started_date: 'asc',
      },
    })
    
     return maintenances as any
  }

  async findMaintenancesByPlate(
    plate: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          asset: {
            plate: {
              contains: plate,
              mode: 'insensitive',
            },
          },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          asset: {
            plate: {
              contains: plate,
              mode: 'insensitive',
            },
          },
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

  async findMaintenancesBySerialNumber(
    serialNumber: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where: {
          is_Active: true,
          asset: {
            serial_number: {
              contains: serialNumber,
              mode: 'insensitive',
            },
          },
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
          serviceCategory: true,
        },
      }),
      prisma.maintenance.count({
        where: {
          is_Active: true,
          asset: {
            serial_number: {
              contains: serialNumber,
              mode: 'insensitive',
            },
          },
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

  async findScheduledOnly(
    params?: FindScheduledOnlyParams,
  ): Promise<Maintenance[]> {
    const where: Prisma.MaintenanceWhereInput = {
      is_Active: true,
      status: 'SCHEDULED', // Apenas agendadas, não inclui IN_PROGRESS
    }

    // Filtro por período (opcional)
    if (params?.startDate || params?.endDate) {
      where.scheduled_date = {}

      if (params.startDate) {
        where.scheduled_date.gte = params.startDate
      }

      if (params.endDate) {
        where.scheduled_date.lte = params.endDate
      }
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
      include: {
        asset: {
          include: {
            assetCategory: true,
          },
        },
        supplier: true,
        serviceCategory: true,
      },
      orderBy: {
        scheduled_date: 'asc',
      },
      // SEM take/skip = sem paginação
    })

    return maintenances
  }
}
