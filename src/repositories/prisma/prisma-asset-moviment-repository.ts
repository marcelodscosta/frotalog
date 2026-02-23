import { AssetMovement, Prisma, BillingCycle } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IAssetMovementRepository } from '../interfaces/IAssetMovimentRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaAssetMovementRepository implements IAssetMovementRepository {
  private readonly PAGE_SIZE = 20

  async create(
    data: Prisma.AssetMovementUncheckedCreateInput,
  ): Promise<AssetMovement> {
    const assetMovement = await prisma.assetMovement.create({
      data,
    })
    return assetMovement
  }

  async updateAssetMovement(
    id: string,
    data: Prisma.AssetMovementUpdateInput,
  ): Promise<AssetMovement> {
    const updatedAssetMovement = await prisma.assetMovement.update({
      where: { id },
      data,
    })
    return updatedAssetMovement
  }

  async findById(id: string): Promise<AssetMovement | null> {
    const assetMovement = await prisma.assetMovement.findUnique({
      where: { id },
    })
    return assetMovement
  }

  // Deleção lógica (is_active conforme schema)
  async deleteAssetMovement(id: string): Promise<AssetMovement> {
    const deletedAssetMovement = await prisma.assetMovement.update({
      where: { id },
      data: { is_active: false },
    })
    return deletedAssetMovement
  }

  // Listagens paginadas
  async findAll(page: number): Promise<PaginatedResult<AssetMovement>> {
    const skip = (page - 1) * this.PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.assetMovement.findMany({
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
      }),
      prisma.assetMovement.count(),
    ])

    const totalPages = Math.ceil(totalItems / this.PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findAllUnpaginated(): Promise<AssetMovement[]> {
    const assetMovements = await prisma.assetMovement.findMany({
      orderBy: { created_at: 'desc' },
    })
    return assetMovements
  }

  // Filtros por entidade relacionada
  async findByContractId(
    contractId: string,
    page: number,
  ): Promise<PaginatedResult<AssetMovement>> {
    const skip = (page - 1) * this.PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.assetMovement.findMany({
        where: { contractId },
        include: { asset: true },
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
      }),
      prisma.assetMovement.count({
        where: { contractId },
      }),
    ])

    const totalPages = Math.ceil(totalItems / this.PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<AssetMovement>> {
    const skip = (page - 1) * this.PAGE_SIZE

    const [items, totalItems] = await prisma.$transaction([
      prisma.assetMovement.findMany({
        where: { assetId },
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
      }),
      prisma.assetMovement.count({
        where: { assetId },
      }),
    ])

    const totalPages = Math.ceil(totalItems / this.PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findActiveByAssetId(assetId: string): Promise<AssetMovement | null> {
    const assetMovement = await prisma.assetMovement.findFirst({
      where: {
        assetId,
        is_active: true,
      },
    })
    return assetMovement
  }

  // Busca por campos específicos
  async findByAssetAndContract(
    assetId: string,
    contractId: string,
  ): Promise<AssetMovement | null> {
    const assetMovement = await prisma.assetMovement.findFirst({
      where: {
        assetId,
        contractId,
      },
    })
    return assetMovement
  }

  async findActiveByAssetAndContract(
    assetId: string,
    contractId: string,
  ): Promise<AssetMovement | null> {
    const assetMovement = await prisma.assetMovement.findFirst({
      where: {
        assetId,
        contractId,
        is_active: true,
        demobilization_date: null,
      },
    })
    return assetMovement
  }

  async findActiveNotDemobilizedByAssetId(
    assetId: string,
  ): Promise<AssetMovement | null> {
    const assetMovement = await prisma.assetMovement.findFirst({
      where: {
        assetId,
        is_active: true,
        demobilization_date: null,
      },
    })
    return assetMovement
  }

  // Busca avançada
  async search(params: {
    assetId?: string
    contractId?: string
    billingCycle?: BillingCycle
    isActive?: boolean
    mobilizationDateFrom?: Date
    mobilizationDateTo?: Date
    page: number
  }): Promise<PaginatedResult<AssetMovement>> {
    const {
      page,
      mobilizationDateFrom,
      mobilizationDateTo,
      isActive,
      ...filters
    } = params
    const skip = (page - 1) * this.PAGE_SIZE

    const where: Prisma.AssetMovementWhereInput = {
      ...filters,
      is_active: isActive,
      mobilization_date: {
        gte: mobilizationDateFrom,
        lte: mobilizationDateTo,
      },
    }

    const [items, totalItems] = await prisma.$transaction([
      prisma.assetMovement.findMany({
        where,
        skip,
        take: this.PAGE_SIZE,
        orderBy: { created_at: 'desc' },
        include: {
          asset: {
            include: {
              assetCategory: true,
              Maintenance: {
                where: {
                  contractId: filters.contractId,
                },
                include: {
                  serviceCategory: true,
                  supplier: true,
                },
                orderBy: {
                  scheduled_date: 'desc'
                }
              }
            }
          },
          contract: true,
        },
      }),
      prisma.assetMovement.count({
        where,
      }),
    ])

    const totalPages = Math.ceil(totalItems / this.PAGE_SIZE)

    return {
      items,
      currentPage: page,
      pageSize: this.PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  // Operações específicas do domínio
  async updateBillingCycle(
    id: string,
    billingCycle: BillingCycle,
  ): Promise<AssetMovement> {
    const updatedAssetMovement = await prisma.assetMovement.update({
      where: { id },
      data: { billing_cycle: billingCycle },
    })
    return updatedAssetMovement
  }

  async updateMovementDates(
    id: string,
    integrationDate?: Date,
    demobilizationDate?: Date,
  ): Promise<AssetMovement> {
    const updatedAssetMovement = await prisma.assetMovement.update({
      where: { id },
      data: {
        integration_date: integrationDate,
        demobilization_date: demobilizationDate,
      },
    })
    return updatedAssetMovement
  }

  // Relatórios e agregações
  async getAssetMovementsSummaryByContract(
    contractId: string,
  ): Promise<AssetMovement[]> {
    const assetMovements = await prisma.assetMovement.findMany({
      where: { contractId },
      orderBy: { mobilization_date: 'desc' },
    })
    return assetMovements
  }

  async getActiveMovementsByAsset(assetId: string): Promise<AssetMovement[]> {
    const assetMovements = await prisma.assetMovement.findMany({
      where: {
        assetId,
        is_active: true,
      },
      orderBy: { mobilization_date: 'desc' },
    })
    return assetMovements
  }

  // Com detalhes relacionados
  async getAssetMovementWithDetails(id: string): Promise<AssetMovement | null> {
    const assetMovement = await prisma.assetMovement.findUnique({
      where: { id },
      include: {
        asset: true,
        contract: true,
      },
    })
    return assetMovement
  }
}
