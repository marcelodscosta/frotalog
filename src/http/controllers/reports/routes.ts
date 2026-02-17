import { FastifyInstance } from 'fastify'
import { getMaintenanceReport } from './maintenance-report-controller'
import { requireAuth } from '../../middleware/auth'
import { maintenanceReportByAsset } from './maintenance-report-by-asset-controller'
import { getAssetsByWorksiteReport } from './get-assets-by-worksite-report-controller'

export async function reportsRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de relatórios
  app.addHook('preHandler', requireAuth())

  app.get('/reports/maintenance', getMaintenanceReport)
  app.get('/reports/maintenance/asset', maintenanceReportByAsset)
  app.get('/reports/assets-by-worksite', getAssetsByWorksiteReport)
}
