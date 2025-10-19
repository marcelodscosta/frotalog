import { Maintenance, Prisma } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IMaintenanceRepository {
  create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance>
  updateMaintenance(id: string, data: Prisma.MaintenanceUpdateInput): Promise<Maintenance>
  
  findById(id: string): Promise<Maintenance | null>
  findByAssetId(assetId: string, page: number): Promise<PaginatedResult<Maintenance>>
  findBySupplierId(supplierId: string, page: number): Promise<PaginatedResult<Maintenance>>
  findByStatus(status: Prisma.MaintenanceStatus, page: number): Promise<PaginatedResult<Maintenance>>
  findByType(type: Prisma.MaintenanceType, page: number): Promise<PaginatedResult<Maintenance>>
  
  findAll(page: number): Promise<PaginatedResult<Maintenance>>
  findScheduledMaintenances(page: number): Promise<PaginatedResult<Maintenance>>
  findOverdueMaintenances(page: number): Promise<PaginatedResult<Maintenance>>
  
  updateStatus(id: string, status: Prisma.MaintenanceStatus): Promise<Maintenance>
  updateCosts(id: string, estimatedCost?: number, actualCost?: number): Promise<Maintenance>
  
  deactivateMaintenance(id: string): Promise<Maintenance>
  activateMaintenance(id: string): Promise<Maintenance>
}
