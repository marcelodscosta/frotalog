import { AssetMovement, Prisma, BillingCycle } from '../../generated/prisma'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export interface IAssetMovementRepository {
  // Criação
  create(data: Prisma.AssetMovementUncheckedCreateInput): Promise<AssetMovement>

  // Atualização completa
  updateAssetMovement(
    id: string,
    data: Prisma.AssetMovementUpdateInput,
  ): Promise<AssetMovement>

  // Busca por ID
  findById(id: string): Promise<AssetMovement | null>

  // Deleção lógica
  deleteAssetMovement(id: string): Promise<AssetMovement>

  // Listagens paginadas
  findAll(page: number): Promise<PaginatedResult<AssetMovement>>
  findAllUnpaginated(): Promise<AssetMovement[]>

  // Filtros por entidade relacionada
  findByContractId(
    contractId: string,
    page: number,
  ): Promise<PaginatedResult<AssetMovement>>
  findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<AssetMovement>>
  findActiveByAssetId(assetId: string): Promise<AssetMovement | null>

  // Busca por campos específicos
  findByAssetAndContract(
    assetId: string,
    contractId: string,
  ): Promise<AssetMovement | null>
  findActiveByAssetAndContract(
    assetId: string,
    contractId: string,
  ): Promise<AssetMovement | null>
  findActiveNotDemobilizedByAssetId(
    assetId: string,
  ): Promise<AssetMovement | null>

  // Busca avançada
  search(params: {
    assetId?: string
    contractId?: string
    billingCycle?: BillingCycle
    isActive?: boolean
    mobilizationDateFrom?: Date
    mobilizationDateTo?: Date
    page: number
    unpaginated?: boolean
  }): Promise<PaginatedResult<AssetMovement>>

  // Operações específicas do domínio
  updateBillingCycle(
    id: string,
    billingCycle: BillingCycle,
  ): Promise<AssetMovement>
  updateMovementDates(
    id: string,
    integrationDate?: Date,
    demobilizationDate?: Date,
  ): Promise<AssetMovement>

  // Relatórios e agregações
  getAssetMovementsSummaryByContract(
    contractId: string,
  ): Promise<AssetMovement[]>
  getActiveMovementsByAsset(assetId: string): Promise<AssetMovement[]>

  // Com detalhes relacionados
  getAssetMovementWithDetails(id: string): Promise<AssetMovement | null>
}
