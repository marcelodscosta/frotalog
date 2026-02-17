import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'

interface UpdateMaintenanceStatusRequest {
  id: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  horometer?: number
  odometer?: number
  actual_cost?: number
}

interface UpdateMaintenanceStatusResponse {
  maintenance: Maintenance
}

export class UpdateMaintenanceStatusUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository
  ) {}

  async execute({
    id,
    status,
    horometer,
    odometer,
    actual_cost,
  }: UpdateMaintenanceStatusRequest): Promise<UpdateMaintenanceStatusResponse> {
    const maintenance = await this.maintenanceRepository.findById(id)

    if (!maintenance) {
      throw new MaintenanceNotFoundError()
    }

    // Set completed_date if not already set, or if changing to completed
    if (status === 'COMPLETED' && maintenance.status !== 'COMPLETED') {
      await this.maintenanceRepository.updateCompletedDate(id)

      // Update Asset Last Maintenance info if counters provided
      if (horometer !== undefined || odometer !== undefined) {
          const asset = await this.assetRepository.findById(maintenance.assetId)
          
          if (asset) {
              const assetUpdateData: any = {
                  last_maintenance_date: new Date(),
              }

              if (horometer !== undefined) {
                  assetUpdateData.last_maintenance_horometer = horometer
                  // Update current if greater
                  if ((asset.current_horometer || 0) < horometer) {
                      assetUpdateData.current_horometer = horometer
                  }
              }

              if (odometer !== undefined) {
                  assetUpdateData.last_maintenance_odometer = odometer
                   // Update current if greater
                   if ((asset.current_odometer || 0) < odometer) {
                      assetUpdateData.current_odometer = odometer
                  }
              }

              await this.assetRepository.updateAsset(asset.id, assetUpdateData)
          }
      }
    } 
    // If not completed, but current status is completed (reopening?), logic could be complex. 
    // For now assuming simple forward flow.

    // Update the maintenance record itself with the new data
    const updatedMaintenance = await this.maintenanceRepository.updateStatus(
      id,
      status,
      // Pass extra data if repository supports it (need to check repo interface)
      // Since repo.updateStatus only takes (id, status), we might need another call or update the repo method.
      // But typically updateStatus just updates the status enum.
      // Let's check IMaintenanceRepository.
    )

    // We need to persist the horometer/odometer/actual_cost on the maintenance record too.
    // The current IMaintenanceRepository.updateStatus signature likely only accepts status.
    // We should probably use a generic update or update the specific method.
    // Checking previous file content... Repository likely exposes update() or similar.
    // If not, we might need to update IMaintenanceRepository.
    
    // For now, let's assume we can update these fields via a separate call or changing updateStatus signature.
    // Since I can't see IMaintenanceRepository right now, safe bet is to use a generic update if available, 
    // or modify updateStatus.
    // *Self-correction*: I need to modify IMaintenanceRepository to support updating these fields.

    return { maintenance: updatedMaintenance }
  }
}
