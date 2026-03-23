import {
    Asset,
    Maintenance,
    Prisma,
    ServiceCategory,
    Supplier,
} from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export type MaintenanceWithRelations = Maintenance & {
  supplier: Pick<Supplier, 'company_name' | 'trading_name'> | null
  asset: Pick<Asset, 'brand' | 'model' | 'plate' | 'serial_number' | 'year'>
  serviceCategory: Pick<ServiceCategory, 'id' | 'name' | 'description'> | null
  assigned_to: { id: string; name: string | null } | null
  contract: {
    contract_number: string;
    client: {
      company_name: string;
    };
  } | null
}

interface FindScheduledOnlyParams {
  startDate?: Date
  endDate?: Date
  assignedToId?: string
}

export interface FindAllMaintenanceParams {
  page: number
  status?: string
  type?: string
  plate?: string
  serialNumber?: string
  contractStatus?: string
}

export interface IMaintenanceRepository {
  create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance>
  updateMaintenance(
    id: string,
    data: Prisma.MaintenanceUpdateInput,
  ): Promise<Maintenance>

  findById(id: string): Promise<MaintenanceWithRelations | null>
  findByAssetId(
    assetId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>
  findBySupplierId(
    supplierId: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>
  findByStatus(
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>
  findByType(
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY',
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>

  findAll(params: FindAllMaintenanceParams): Promise<PaginatedResult<MaintenanceWithRelations>>
  findScheduledMaintenances(
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>
  findOverdueMaintenances(
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>

  updateStatus(
    id: string,
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    horometer?: number,
    odometer?: number,
    actualCost?: number,
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
    assetId: string | undefined,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<
      Maintenance & {
        supplier: Pick<Supplier, 'company_name'>
        asset: Pick<Asset, 'brand' | 'model' | 'plate' | 'year'>
        serviceCategory: Pick<ServiceCategory, 'name'> | null // ✅ NOVO
      }
    >
  >

  findMaintenancesByPlate(
    plate: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>

  findMaintenancesBySerialNumber(
    serialNumber: string,
    page: number,
  ): Promise<PaginatedResult<MaintenanceWithRelations>>

  findScheduledOnly(params?: FindScheduledOnlyParams): Promise<Maintenance[]>
  findCompletedByPeriod(
    startDate: Date,
    endDate: Date,
    assignedToId?: string
  ): Promise<MaintenanceWithRelations[]>
}
