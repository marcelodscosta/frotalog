import { prisma } from '../../lib/prisma'

export class AssetAvailabilityReportUseCase {
  async execute() {
    console.log("Starting AssetAvailabilityReportUseCase.execute")
    try {
      // 1. Fetch all active assets with their movements and open maintenances
      const assets = await prisma.asset.findMany({
        where: { is_Active: true },
        include: {
          Movements: {
            where: { demobilization_date: null },
            include: { 
              contract: {
                include: { client: true }
              } 
            },
          },
          Maintenance: {
            where: {
              status: { in: ['IN_PROGRESS', 'SCHEDULED'] },
              is_Active: true
            }
          },
          assetCategory: true
        }
      })

      const report = {
          totalAssets: assets.length,
          available: 0,
          allocated: 0,
          maintenance: 0,
          details: [] as any[]
      }

      // 2. Classify Assets
      for (const asset of assets) {
          let status = 'AVAILABLE'
          let contractInfo = null
          let maintenanceInfo = null

          // Check Allocation
          if (asset.Movements.length > 0) {
              status = 'ALLOCATED'
              const activeMovement = asset.Movements[0]
              contractInfo = {
                  number: activeMovement.contract.contract_number,
                  description: activeMovement.contract.description,
                  clientName: activeMovement.contract.client.trading_name || activeMovement.contract.client.company_name
              }
          }

          // Check Maintenance
          if (asset.Maintenance.length > 0) {
               const activeMaintenance = asset.Maintenance.find(m => m.status === 'IN_PROGRESS')
               if (activeMaintenance) {
                   maintenanceInfo = activeMaintenance.description
               }
          }

          if (status === 'ALLOCATED') report.allocated++
          else report.available++

          report.details.push({
              id: asset.id,
              plate: asset.plate || asset.serial_number,
              model: asset.model,
              brand: asset.brand,
              category: asset.assetCategory.name,
              status,
              contract: contractInfo,
              inMaintenance: !!maintenanceInfo
          })
      }

      return report
    } catch (error) {
        console.error("Error in AssetAvailabilityReportUseCase:", error)
        throw error
    }
  }
}
