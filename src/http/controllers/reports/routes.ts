import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { getAssetsByWorksiteReport } from './get-assets-by-worksite-report-controller'
import { getMaintenancePredictionReport } from './maintenance-prediction-report-controller'
import { getMaintenanceFinancialReport } from './maintenance-financial-report-controller'
import { getAssetAvailabilityReport } from './asset-availability-report-controller'
import { maintenanceReportByAsset } from './maintenance-report-by-asset-controller'

export async function reportsRoutes(app: FastifyInstance) {
  app.get(
    '/reports/assets-by-worksite',
    { preHandler: [requireAuth()] },
    getAssetsByWorksiteReport,
  )
  
  app.get(
    '/reports/maintenance-prediction',
    { preHandler: [requireAuth()] },
    getMaintenancePredictionReport,
  )

  app.get(
    '/reports/maintenance-financial',
    { preHandler: [requireAuth()] },
    getMaintenanceFinancialReport,
  )

  app.get(
    '/reports/assets-availability',
    { preHandler: [requireAuth()] },
    getAssetAvailabilityReport,
  )

  app.get(
    '/reports/maintenance/asset',
    { preHandler: [requireAuth()] },
    maintenanceReportByAsset,
  )
}
