import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import {
  createChartOfAccountController,
  listChartOfAccountsController,
  updateChartOfAccountController,
  deleteChartOfAccountController,
} from './chart-of-accounts-controllers'

export async function financeRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  // Chart of Accounts
  app.post('/chart-of-accounts', createChartOfAccountController)
  app.get('/chart-of-accounts', listChartOfAccountsController)
  app.patch('/chart-of-accounts/:id', updateChartOfAccountController)
  app.delete('/chart-of-accounts/:id', deleteChartOfAccountController)
}
