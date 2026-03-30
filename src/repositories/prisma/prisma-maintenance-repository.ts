import {
  Asset,
  Maintenance,
  Prisma,
  ServiceCategory,
  Supplier,
} from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import {
  IMaintenanceRepository,
  MaintenanceWithRelations,
} from '../interfaces/IMaintenanceRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

const MAINTENANCE_INCLUDE = {
  asset: {
    include: {
      assetCategory: true,
    },
  },
  contract: {
    select: {
      contract_number: true,
      client: {
        select: {
          company_name: true,
        },
      },
    },
  },
  supplier: true,
  serviceCategory: true,
  documents: true,
  assigned_to: { select: { id: true, name: true } },
  payableExpenses: {
    include: {
      installments: {
        select: { status: true }
      }
    }
  }
} satisfies Prisma.MaintenanceInclude

interface FindScheduledOnlyParams {
  startDate?: Date
  endDate?: Date
  assignedToId?: string
}

export class PrismaMaintenanceRepository implements IMaintenanceRepository {
  async create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance> {
    const maintenance = await prisma.maintenance.create({
      data: {
        ...data,
        asset: { connect: { id: (data.asset as any).connect?.id } },
        supplier: (data.supplier as any)?.connect?.id 
            ? { connect: { id: (data.supplier as any).connect.id } } 
            : undefined,
        serviceCategory: (data.serviceCategory as any)?.connect?.id
          ? { connect: { id: (data.serviceCategory as any).connect.id } }
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
      include: MAINTENANCE_INCLUDE,
    })

    return updateMaintenance as any
  }

  async findById(id: string): Promise<MaintenanceWithRelations | null> {
    const maintenance = await prisma.maintenance.findUnique({
      where: {
        id,
        is_Active: true,
      },
      include: MAINTENANCE_INCLUDE,
    })
    return maintenance as MaintenanceWithRelations | null
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAll(
    params: {
      page: number
      status?: string
      type?: string
      plate?: string
      serialNumber?: string
      contractStatus?: string
    }
  ): Promise<PaginatedResult<MaintenanceWithRelations>> {
    const PAGE_SIZE = 20
    const skip = (params.page - 1) * PAGE_SIZE

    const where: Prisma.MaintenanceWhereInput = {
      is_Active: true,
      status: params.status ? (params.status as any) : { not: 'CANCELLED' },
    }

    if (params.type) {
      where.type = params.type as any
    }

    if (params.plate || params.serialNumber) {
      where.asset = {}
      if (params.plate) {
        where.asset.plate = {
          contains: params.plate,
          mode: 'insensitive',
        }
      }
      if (params.serialNumber) {
        where.asset.serial_number = {
          contains: params.serialNumber,
          mode: 'insensitive',
        }
      }
    }

    if (params.contractStatus) {
      if (params.contractStatus === 'ACTIVE') {
        const mobilizedAssetIds = (await prisma.assetMovement.findMany({
          where: {
            is_active: true,
            demobilization_date: null,
            contract: { status: 'ACTIVE' }
          },
          select: { assetId: true }
        })).map(m => m.assetId);

        where.OR = [
          { contract: { status: 'ACTIVE' } },
          { contractId: null, assetId: { in: mobilizedAssetIds } }
        ]
      } else if (params.contractStatus === 'INACTIVE') {
        const mobilizedAssetIds = (await prisma.assetMovement.findMany({
          where: {
            is_active: true,
            demobilization_date: null,
            contract: { status: 'ACTIVE' }
          },
          select: { assetId: true }
        })).map(m => m.assetId);

        where.OR = [
          { contract: { status: { not: 'ACTIVE' } } },
          { contractId: null, assetId: { notIn: mobilizedAssetIds } }
        ]
      } else {
        const contractId = params.contractStatus
        const contract = await prisma.contract.findUnique({
          where: { id: contractId },
          select: { start_date: true, end_date: true },
        })

        if (contract) {
          const movements = await prisma.assetMovement.findMany({
            where: { contractId },
            select: { assetId: true },
          })
          const assetIds = movements.map((m) => m.assetId)

          where.OR = [
            { contractId },
            {
              contractId: null,
              assetId: { in: assetIds },
              scheduled_date: {
                gte: contract.start_date,
                ...(contract.end_date ? { lte: contract.end_date } : {}),
              },
            },
          ]
        } else {
          where.contractId = contractId
        }
      }
    }

    const [maintenances, totalCount] = await prisma.$transaction([
      prisma.maintenance.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: { scheduled_date: 'desc' },
        include: MAINTENANCE_INCLUDE,
      }),
      prisma.maintenance.count({
        where,
      }),
    ])

    // População automática de contrato para ativos que estão mobilizados no momento
    const nullContractAssetIds = (maintenances as any[])
      .filter((m) => !m.contract)
      .map((m) => m.assetId)

    const activeMovements = await prisma.assetMovement.findMany({
      where: {
        assetId: { in: nullContractAssetIds },
        is_active: true,
        demobilization_date: null,
        contract: { status: 'ACTIVE' },
      },
      include: {
        contract: {
          select: {
            contract_number: true,
            client: { select: { company_name: true } },
          },
        },
      },
    })

    const assetToContractMap = new Map(
      activeMovements.map((am) => [am.assetId, am.contract]),
    )

    const items = (maintenances as any[]).map((m) => {
      if (!m.contract) {
        const activeContract = assetToContractMap.get(m.assetId)
        if (activeContract) {
          return { ...m, contract: activeContract }
        }
      }
      return m
    })

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: items as MaintenanceWithRelations[],
      currentPage: params.page,
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
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

    if (status === 'IN_PROGRESS') {
      updateData.started_date = new Date()
      updateData.completed_date = null
    } else if (['SCHEDULED', 'CANCELLED'].includes(status)) {
      updateData.started_date = null
    }

    if (status === 'SCHEDULED') {
      updateData.completed_date = null
    } else if (status === 'COMPLETED') {
      updateData.completed_date = new Date()
    }

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
        completed_date: new Date(),
      },
    })
    return updateMaintenance
  }

  async findMaintenancesByAssetPeriod(
    assetId: string | undefined,
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
    const where: Prisma.MaintenanceWhereInput = {
      is_Active: true,
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
    }

    if (assetId) {
      where.assetId = assetId
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
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
        include: MAINTENANCE_INCLUDE,
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
      items: maintenances as MaintenanceWithRelations[],
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findScheduledOnly(
    params?: FindScheduledOnlyParams,
  ): Promise<Maintenance[]> {
    const now = new Date()
    const where: Prisma.MaintenanceWhereInput = {
      is_Active: true,
      OR: [
        {
          status: 'IN_PROGRESS',
        },
        {
          status: 'SCHEDULED',
          // Se houver filtros de data, aplicamos aqui
          ...(params?.startDate || params?.endDate
            ? {
                scheduled_date: {
                  gte: params.startDate,
                  lte: params.endDate,
                },
              }
            : {}),
        },
        // Também incluímos as atrasadas (SCHEDULED no passado) mesmo que fora do range gte
        {
          status: 'SCHEDULED',
          scheduled_date: {
            lt: params?.startDate || now,
          },
        },
      ],
    }

    if (params?.assignedToId) {
      where.assignedToId = params.assignedToId
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
      include: MAINTENANCE_INCLUDE,
      orderBy: {
        scheduled_date: 'asc',
      },
      // SEM take/skip = sem paginação
    })

    return maintenances
  }

  async findCompletedByPeriod(
    startDate: Date,
    endDate: Date,
    assignedToId?: string
  ): Promise<MaintenanceWithRelations[]> {
    const where: Prisma.MaintenanceWhereInput = {
      is_Active: true,
      status: 'COMPLETED',
      completed_date: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (assignedToId) {
      where.assignedToId = assignedToId
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
      include: {
        asset: {
          select: {
            brand: true,
            model: true,
            plate: true,
            year: true,
            serial_number: true,
          },
        },
        supplier: {
          select: {
            company_name: true,
            trading_name: true,
          },
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        assigned_to: { select: { id: true, name: true } },
      },
      orderBy: {
        completed_date: 'desc',
      },
    })

    return maintenances as any
  }

  async findInactiveByAssetAndPeriod(
    assetId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Maintenance[]> {
    return prisma.maintenance.findMany({
      where: {
        assetId,
        equipment_inactive: true,
        is_Active: true,
        status: {
          in: ['IN_PROGRESS', 'COMPLETED'],
        },
        OR: [
          { started_date: { gte: startDate, lte: endDate } },
          { completed_date: { gte: startDate, lte: endDate } },
          {
            AND: [
              { started_date: { lte: startDate } },
              {
                OR: [
                  { completed_date: { gte: endDate } },
                  { completed_date: null },
                ],
              },
            ],
          },
          {
            AND: [
              { started_date: null },
              { scheduled_date: { gte: startDate, lte: endDate } },
            ],
          },
        ],
      },
    })
  }
}
