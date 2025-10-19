import { FastifyInstance } from 'fastify'
import { getMaintenanceReport } from './maintenance-report-controller'
import { requireAuth } from '../../middleware/auth'

export async function reportsRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de relatórios
  app.addHook('preHandler', requireAuth())
  
  app.get('/reports/maintenance', getMaintenanceReport)
}
