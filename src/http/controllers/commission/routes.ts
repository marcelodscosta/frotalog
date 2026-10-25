import { FastifyInstance } from 'fastify'
import { listCommissions } from './list-commissions-controller'
import { updateCommissionStatus } from './update-commission-status-controller'
import { updateCommission } from './update-commission-controller'
import { requireAdmin, requireAuth } from '../../middleware/auth'

export async function commissionRoutes(app: FastifyInstance) {
  // Qualquer usuário autenticado pode listar; vendedores só veem as próprias comissões.
  // Somente Admin altera status ou informa o valor base do mês.
  app.get('/commissions', { preHandler: requireAuth() }, listCommissions)
  app.patch('/commissions/:id/status', { preHandler: requireAdmin() }, updateCommissionStatus)
  app.patch('/commissions/:id', { preHandler: requireAdmin() }, updateCommission)
}
