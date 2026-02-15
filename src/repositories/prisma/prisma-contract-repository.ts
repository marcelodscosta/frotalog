import { Prisma, Contract, ContractStatus } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IContractRepository } from '../interfaces/IContractRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaContractRepository implements IContractRepository {
  async create(data: Prisma.ContractUncheckedCreateInput): Promise<Contract> {
    const contract = await prisma.contract.create({ data })
    return contract
  }

  async updateContract(
    id: string,
    data: Prisma.ContractUpdateInput,
  ): Promise<Contract> {
    const updateContract = await prisma.contract.update({
      where: { id },
      data,
    })
    return updateContract
  }

  async findById(id: string): Promise<Contract | null> {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        client: true,
      },
    })
    return contract
  }

  async deleteContract(id: string): Promise<Contract> {
    const contract = await prisma.contract.update({
      where: { id },
      data: { is_Active: false },
    })
    return contract
  }

  async findAll(page: number): Promise<PaginatedResult<Contract>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [contracts, totalCount] = await prisma.$transaction([
      prisma.contract.findMany({
        where: { is_Active: true },
        skip,
        take: PAGE_SIZE,
        include: {
          client: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.contract.count({ where: { is_Active: true } }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: contracts,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAllUnpaginated(): Promise<Contract[]> {
    return await prisma.contract.findMany({
      where: { is_Active: true },
      include: { client: true },
      orderBy: { contract_number: 'asc' },
    })
  }

  async findByClient(
    client: string,
    page: number,
  ): Promise<PaginatedResult<Contract>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const where: Prisma.ContractWhereInput = {
      is_Active: true,
      client: {
        OR: [
          { company_name: { contains: client, mode: 'insensitive' } },
          { trading_name: { contains: client, mode: 'insensitive' } },
        ],
      },
    }

    const [contracts, totalCount] = await prisma.$transaction([
      prisma.contract.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        include: { client: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.contract.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: contracts,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByContractNumber(
    contract_number: string,
  ): Promise<Contract | null> {
    return await prisma.contract.findUnique({
      where: { contract_number },
      include: { client: true },
    })
  }

  async search({
    contract_number,
    description,
    client,
    status,
    page,
  }: {
    contract_number?: string
    description?: string
    client?: string
    status?: ContractStatus
    page: number
  }): Promise<PaginatedResult<Contract>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const where: Prisma.ContractWhereInput = {
      is_Active: true,
    }

    if (contract_number) {
      where.contract_number = { contains: contract_number, mode: 'insensitive' }
    }

    if (description) {
      where.description = { contains: description, mode: 'insensitive' }
    }

    if (status) {
      where.status = status
    }

    if (client) {
      where.client = {
        OR: [
          { company_name: { contains: client, mode: 'insensitive' } },
          { trading_name: { contains: client, mode: 'insensitive' } },
        ],
      }
    }

    const [contracts, totalCount] = await prisma.$transaction([
      prisma.contract.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        include: { client: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.contract.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: contracts,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    const contract = await prisma.contract.update({
      where: { id },
      data: { status },
    })
    return contract
  }

  async getContractWithDetails(id: string): Promise<Contract | null> {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        client: true,
        movements: {
          include: {
            asset: {
              include: { assetCategory: true },
            },
          },
          orderBy: { mobilization_date: 'desc' },
        },
        maintenances: {
          include: {
            serviceCategory: true,
            supplier: true,
          },
          orderBy: { scheduled_date: 'desc' },
        },
      },
    })
    return contract
  }

  async findActiveByAssetId(assetId: string): Promise<Contract | null> {
    const contract = await prisma.contract.findFirst({
      where: {
        status: { in: ['ACTIVE', 'DRAFT'] },
        movements: {
          some: {
            assetId,
            is_active: true,
          },
        },
      },
      include: { client: true },
    })
    return contract
  }
}
