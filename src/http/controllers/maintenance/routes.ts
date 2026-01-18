import { FastifyInstance } from 'fastify'
import { createMaintenance } from './create-maintenance-controller'
import { findAllMaintenances } from './find-all-maintenance-controller'
import { getMaintenanceById } from './get-maintenance-by-id-controller'
import { updateMaintenanceStatus } from './update-maintenance-status-controller'
import { updateMaintenance } from './update-maintenance-controller'
import { requireAuth } from '../../middleware/auth'
import { getMaintenancesByType } from './get-maintenance-by-type-controller'
import { getMaintenancesByStatus } from './get-maintenance-by-status-controller'

export async function maintenanceRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de manutenções
  app.addHook('preHandler', requireAuth())

  app.post('/maintenance', createMaintenance)
  app.get('/maintenance/search', findAllMaintenances)
  app.get('/maintenance/search/:id', getMaintenanceById)
  app.patch('/maintenance/:id/status', updateMaintenanceStatus)
  app.patch('/maintenance/:id', updateMaintenance)

  app.get('/maintenance/search/type', getMaintenancesByType)
  app.get('/maintenance/search/status', getMaintenancesByStatus)
}
