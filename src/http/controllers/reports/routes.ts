import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { getAssetsByWorksiteReport } from './get-assets-by-worksite-report-controller'
import { getMaintenancePredictionReport } from './maintenance-prediction-report-controller'

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
}
