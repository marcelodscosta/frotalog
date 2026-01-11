import { Asset, Maintenance, Prisma, Supplier } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IMaintenanceRepository {
  create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance>
  updateMaintenance(
    id: string,
    data: Prisma.MaintenanceUpdateInput,
  ): Promise<Maintenance>

  findById(id: string): Promise<Maintenance | null>
  findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<Maintenance>>
  findBySupplierId(
    supplierId: string,
    page: number,
  ): Promise<PaginatedResult<Maintenance>>
  findByStatus(
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    page: number,
  ): Promise<PaginatedResult<Maintenance>>
  findByType(
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY',
    page: number,
  ): Promise<PaginatedResult<Maintenance>>

  findAll(page: number): Promise<PaginatedResult<Maintenance>>
  findScheduledMaintenances(page: number): Promise<PaginatedResult<Maintenance>>
  findOverdueMaintenances(page: number): Promise<PaginatedResult<Maintenance>>

  updateStatus(
    id: string,
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ): Promise<Maintenance>
  updateCosts(
    id: string,
    estimatedCost?: number,
    actualCost?: number,
  ): Promise<Maintenance>
  updateCompletedDate(id: string): Promise<Maintenance>

  deactivateMaintenance(id: string): Promise<Maintenance>
  activateMaintenance(id: string): Promise<Maintenance>

  findMaintenancesByAssetPeriod(
    assetId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<
      Maintenance & {
        supplier: Pick<Supplier, 'company_name'>
        asset: Pick<Asset, 'brand' | 'model' | 'plate' | 'year'>
      }
    >
  >
}
