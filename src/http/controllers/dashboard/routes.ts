import { FastifyInstance } from 'fastify'
import { getDashboardStats } from './get-dashboard-stats-controller'
import { requireAuth } from '../../middleware/auth'

export async function dashboardRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas do dashboard
  app.addHook('preHandler', requireAuth())
  
  app.get('/dashboard/stats', getDashboardStats)
}

