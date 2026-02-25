import { Contract, Prisma, ContractStatus } from '../../generated/prisma'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export interface IContractRepository {
  create(data: Prisma.ContractUncheckedCreateInput): Promise<Contract>

  updateContract(
    id: string,
    data: Prisma.ContractUpdateInput,
  ): Promise<Contract>

  findById(id: string): Promise<Contract | null>

  deleteContract(id: string): Promise<Contract>

  findAll(page: number): Promise<PaginatedResult<Contract>>

  findAllUnpaginated(): Promise<Contract[]>

  findByClient(client: string, page: number): Promise<PaginatedResult<Contract>>

  findByContractNumber(contract_number: string): Promise<Contract | null>

  search(params: {
    contract_number?: string
    description?: string
    client?: string
    status?: ContractStatus
    page: number
  }): Promise<PaginatedResult<Contract>>

  updateStatus(id: string, status: ContractStatus): Promise<Contract>

  getContractWithDetails(id: string): Promise<Contract | null>

  findActiveByAssetId(assetId: string): Promise<Contract | null>

  getFinancialSummary(contractId: string): Promise<{
    totalMaintenanceCost: number
    totalOtherExpenses: number
  } | null>
}
