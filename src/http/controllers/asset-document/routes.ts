import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { createAssetDocument } from './create-asset-document'
import { findByAssetController } from './find-by-asset-controller'
import { updateAssetDocument } from './update-asset-document'
import { deleteAssetDocument } from './delete-asset-document'

export async function assetDocumentRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.get('/assets/:assetId/documents', findByAssetController)
  app.post('/assets/:assetId/documents', createAssetDocument)
  app.patch('/documents/:id', updateAssetDocument)
  app.delete('/documents/:id', deleteAssetDocument)
}
