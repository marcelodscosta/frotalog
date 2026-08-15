import { FastifyInstance } from 'fastify'
import { listCommissions } from './list-commissions-controller'
import { updateCommissionStatus } from './update-commission-status-controller'
import { requireAdmin, requireEmployee } from '../../middleware/auth'

export async function commissionRoutes(app: FastifyInstance) {
  // Admin e Employee podem listar; somente Admin altera status
  app.get('/commissions', { preHandler: requireEmployee() }, listCommissions)
  app.patch('/commissions/:id/status', { preHandler: requireAdmin() }, updateCommissionStatus)
}
