import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { MaintenanceReportUseCase } from '../reports/maintenance-report-use-case'

export function makeMaintenanceReport() {
  const maintenanceRepository = new PrismaMaintenanceRepository()
  const assetRepository = new PrismaAssetRepository()
  const supplierRepository = new PrismaSupplierRepository()
  const maintenanceReportUseCase = new MaintenanceReportUseCase(
    maintenanceRepository,
    assetRepository,
    supplierRepository,
  )
  return maintenanceReportUseCase
}
