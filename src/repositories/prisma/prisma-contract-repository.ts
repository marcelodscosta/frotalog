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
        measurementBulletins: {
          where: { is_active: true },
          select: {
            invoice: {
              select: { id: true, total_value: true, is_active: true, status: true }
            }
          }
        },
        maintenances: {
          where: { is_Active: true },
          select: { 
            payableExpenses: {
              select: { total_value: true, is_active: true, status: true }
            }
          }
        }
      },
    })
    
    if (!contract) return null
    return this.mapContractsWithTotalValue([contract])[0]
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
          measurementBulletins: {
            where: { is_active: true },
            select: {
              invoice: {
                select: { id: true, total_value: true, is_active: true, status: true }
              }
            }
          },
          maintenances: {
            where: { is_Active: true },
            select: { 
              payableExpenses: {
                select: { total_value: true, is_active: true, status: true }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.contract.count({ where: { is_Active: true } }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: this.mapContractsWithTotalValue(contracts),
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findAllUnpaginated(): Promise<Contract[]> {
    const contracts = await prisma.contract.findMany({
      where: { is_Active: true },
      include: { 
        client: true,
        measurementBulletins: {
          where: { is_active: true },
          select: {
            invoice: {
              select: { id: true, total_value: true, is_active: true, status: true }
            }
          }
        },
        maintenances: {
          where: { is_Active: true },
          select: { 
            payableExpenses: {
              select: { total_value: true, is_active: true, status: true }
            }
          }
        }
      },
      orderBy: { contract_number: 'asc' },
    })
    return this.mapContractsWithTotalValue(contracts)
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
        include: { 
          client: true,
          measurementBulletins: {
            where: { is_active: true },
            select: {
              invoice: {
                select: { id: true, total_value: true, is_active: true, status: true }
              }
            }
          },
          maintenances: {
            where: { is_Active: true },
            select: { 
              payableExpenses: {
                select: { total_value: true, is_active: true, status: true }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.contract.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: this.mapContractsWithTotalValue(contracts),
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
        include: { 
          client: true,
          measurementBulletins: {
            where: { is_active: true },
            select: {
              total_value: true,
              expenses: {
                select: { total_value: true }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.contract.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: this.mapContractsWithTotalValue(contracts),
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
            payableExpenses: {
              select: { total_value: true, is_active: true, status: true }
            }
          },
          orderBy: { scheduled_date: 'desc' },
        },
        measurementBulletins: {
          where: { is_active: true },
          select: {
            invoice: {
              select: { id: true, total_value: true, is_active: true, status: true }
            }
          }
        }
      },
    })
    
    if (!contract) return null
    return this.mapContractsWithTotalValue([contract])[0]
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

  async getFinancialSummary(contractId: string): Promise<{ 
    totalMaintenanceCost: number; 
    totalOtherExpenses: number;
    totalBulletinsValue: number;
  } | null> {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    })

    if (!contract) {
      return null
    }

    const movements = await prisma.assetMovement.findMany({
      where: { contractId },
      select: { assetId: true },
    })
    const assetIds = movements.map((m) => m.assetId)

    const maintenances = await prisma.maintenance.findMany({
      where: {
        assetId: { in: assetIds },
        status: { in: ['COMPLETED', 'IN_PROGRESS'] },
        OR: [
          { contractId },
          {
            contractId: null,
            scheduled_date: {
              gte: contract.start_date,
              ...(contract.end_date ? { lte: contract.end_date } : {}),
            },
          },
        ],
      },
      include: {
        payableExpenses: {
           select: { total_value: true, is_active: true, status: true }
        }
      }
    })

    const totalMaintenanceCost = maintenances.reduce((acc, curr) => {
      const expensesTotal = curr.payableExpenses?.reduce((eAcc: number, expense: any) => {
         if (expense.is_active && expense.status !== 'CANCELLED' && expense.status !== 'REJECTED') {
            return eAcc + (Number(expense.total_value) || 0)
         }
         return eAcc
      }, 0) || 0
      return acc + expensesTotal
    }, 0)

    const bulletins = await prisma.measurementBulletin.findMany({
        where: { contractId, is_active: true },
        include: { invoice: true }
    })

    const invoicesMap = new Map<string, number>()
    bulletins.forEach((bulletin) => {
        if (bulletin.invoice && bulletin.invoice.is_active && bulletin.invoice.status !== 'CANCELLED') {
           invoicesMap.set(bulletin.invoice.id, Number(bulletin.invoice.total_value) || 0)
        }
    })
    
    let totalBulletinsValue = 0
    invoicesMap.forEach((val) => totalBulletinsValue += val)

    const totalOtherExpenses = 0

    return { totalMaintenanceCost, totalOtherExpenses, totalBulletinsValue }
  }

  async countByYear(year: number): Promise<number> {
    const startDate = new Date(year, 0, 1) // Jan 1st
    const endDate = new Date(year + 1, 0, 1) // Jan 1st next year

    return await prisma.contract.count({
      where: {
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
    })
  }

  private mapContractsWithTotalValue(contracts: any[]): Contract[] {
    return contracts.map((contract) => {
      // 1. Sum up unique Invoices from measurementBulletins
      const invoicesMap = new Map<string, number>()
      contract.measurementBulletins?.forEach((bulletin: any) => {
        if (bulletin.invoice && bulletin.invoice.is_active && bulletin.invoice.status !== 'CANCELLED') {
           invoicesMap.set(bulletin.invoice.id, Number(bulletin.invoice.total_value) || 0)
        }
      })
      let invoicesTotal = 0
      invoicesMap.forEach((val) => invoicesTotal += val)

      // 2. Sum up PayableExpenses from maintenances
      let expensesTotal = 0
      contract.maintenances?.forEach((maintenance: any) => {
         maintenance.payableExpenses?.forEach((expense: any) => {
            if (expense.is_active && expense.status !== 'CANCELLED' && expense.status !== 'REJECTED') {
               expensesTotal += Number(expense.total_value) || 0
            }
         })
      })

      return {
        ...contract,
        total_measured_value: invoicesTotal,
        total_maintenance_cost: expensesTotal,
        balance: invoicesTotal - expensesTotal,
      } as any
    })
  }
}
