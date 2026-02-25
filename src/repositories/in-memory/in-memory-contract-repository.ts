import { randomUUID } from 'crypto'
import { Contract, ContractStatus, Prisma } from '../../generated/prisma'
import { IContractRepository } from '../interfaces/IContractRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemoryContractRepository implements IContractRepository {
  public items: Contract[] = []

  async create(data: Prisma.ContractUncheckedCreateInput): Promise<Contract> {
    const contract: Contract = {
      id: data.id ?? randomUUID(),
      contract_number: data.contract_number,
      description: data.description ?? null,
      clientId: data.clientId,
      responsible_name: data.responsible_name ?? null,
      responsible_phone: data.responsible_phone ?? null,
      responsible_email: data.responsible_email ?? null,
      start_date: data.start_date instanceof Date ? data.start_date : new Date(data.start_date),
      end_date: data.end_date ? (data.end_date instanceof Date ? data.end_date : new Date(data.end_date)) : null,
      status: (data.status as ContractStatus) ?? 'DRAFT',
      total_value: data.total_value != null ? new Prisma.Decimal(data.total_value.toString()) : null,
      billing_day: data.billing_day ?? null,
      notes: data.notes ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      is_Active: data.is_Active ?? true,
    }
    this.items.push(contract)
    return contract
  }

  async updateContract(
    id: string,
    data: Prisma.ContractUpdateInput,
  ): Promise<Contract> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Contract not found')
    }
    const existing = this.items[index]
    const updated: Contract = {
      ...existing,
      contract_number:
        typeof data.contract_number === 'string'
          ? data.contract_number
          : existing.contract_number,
      description:
        data.description !== undefined
          ? typeof data.description === 'string'
            ? data.description
            : null
          : existing.description,
      responsible_name:
        data.responsible_name !== undefined
          ? typeof data.responsible_name === 'string'
            ? data.responsible_name
            : null
          : existing.responsible_name,
      responsible_phone:
        data.responsible_phone !== undefined
          ? typeof data.responsible_phone === 'string'
            ? data.responsible_phone
            : null
          : existing.responsible_phone,
      responsible_email:
        data.responsible_email !== undefined
          ? typeof data.responsible_email === 'string'
            ? data.responsible_email
            : null
          : existing.responsible_email,
      status:
        typeof data.status === 'string'
          ? (data.status as ContractStatus)
          : existing.status,
      is_Active:
        typeof data.is_Active === 'boolean'
          ? data.is_Active
          : existing.is_Active,
      updated_at: new Date(),
    }
    this.items[index] = updated
    return updated
  }

  async findById(id: string): Promise<Contract | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async deleteContract(id: string): Promise<Contract> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Contract not found')
    }
    this.items[index] = {
      ...this.items[index],
      is_Active: false,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async findAll(page: number): Promise<PaginatedResult<Contract>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const paged = this.items.slice(skip, skip + PAGE_SIZE)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findAllUnpaginated(): Promise<Contract[]> {
    return this.items
  }

  async findByClient(
    client: string,
    page: number,
  ): Promise<PaginatedResult<Contract>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter((item) => item.clientId === client)
    const skip = (page - 1) * PAGE_SIZE
    const paged = filtered.slice(skip, skip + PAGE_SIZE)
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findByContractNumber(
    contract_number: string,
  ): Promise<Contract | null> {
    return (
      this.items.find((item) => item.contract_number === contract_number) ??
      null
    )
  }

  async search(params: {
    contract_number?: string
    description?: string
    client?: string
    status?: ContractStatus
    page: number
  }): Promise<PaginatedResult<Contract>> {
    const PAGE_SIZE = 20
    let filtered = [...this.items]

    if (params.contract_number) {
      filtered = filtered.filter((item) =>
        item.contract_number
          .toLowerCase()
          .includes(params.contract_number!.toLowerCase()),
      )
    }

    if (params.description) {
      filtered = filtered.filter((item) =>
        item.description
          ?.toLowerCase()
          .includes(params.description!.toLowerCase()),
      )
    }

    if (params.client) {
      filtered = filtered.filter((item) => item.clientId === params.client)
    }

    if (params.status) {
      filtered = filtered.filter((item) => item.status === params.status)
    }

    const skip = (params.page - 1) * PAGE_SIZE
    const paged = filtered.slice(skip, skip + PAGE_SIZE)
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: params.page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async updateStatus(
    id: string,
    status: ContractStatus,
  ): Promise<Contract> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Contract not found')
    }
    this.items[index] = {
      ...this.items[index],
      status,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async getContractWithDetails(id: string): Promise<Contract | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findActiveByAssetId(assetId: string): Promise<Contract | null> {
    return (
      this.items.find(
        (item) => item.status === 'ACTIVE' && item.is_Active,
      ) ?? null
    )
  }

  public financialSummaryMockData: { totalMaintenanceCost: number; totalOtherExpenses: number } | null = null;

  async getFinancialSummary(contractId: string): Promise<{ totalMaintenanceCost: number; totalOtherExpenses: number } | null> {
    const contract = await this.findById(contractId)
    if (!contract) return null
    return this.financialSummaryMockData
  }
}
