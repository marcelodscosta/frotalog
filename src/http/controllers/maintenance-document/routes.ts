import { FastifyInstance } from 'fastify'
import { createMaintenanceDocument } from './create-maintenance-document-controller'
import { findAllMaintenanceDocuments } from './find-all-maintenance-document-controller'
import { getMaintenanceDocumentById } from './get-maintenance-document-by-id-controller'
import { getMaintenanceDocumentsByMaintenance } from './get-maintenance-documents-by-maintenance-controller'
import { downloadMaintenanceDocument } from './download-maintenance-document-controller'
import { deleteMaintenanceDocument } from './delete-maintenance-document-controller'
import { requireAuth } from '../../middleware/auth'

export async function maintenanceDocumentRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de documentos
  app.addHook('preHandler', requireAuth())

  app.post('/maintenance/:maintenanceId/document', createMaintenanceDocument)
  app.get('/maintenance-document/search', findAllMaintenanceDocuments)
  app.get('/maintenance-document/search/:id', getMaintenanceDocumentById)
  app.get(
    '/maintenance/:maintenanceId/documents',
    getMaintenanceDocumentsByMaintenance,
  )
  app.get('/maintenance-document/:id/download', downloadMaintenanceDocument)
  app.delete('/maintenance-document/:id', deleteMaintenanceDocument)
}
