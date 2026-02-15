import { FastifyInstance } from 'fastify'
import { createAssetMovement } from './create-asset-movement-controller'
import { requireAuth } from '../../middleware/auth'
import { updateAssetMovementController } from './update-asset-movement-controller'
import { getAssetMovementController } from './get-asset-movement-controller'

export async function assetMovementRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.post('/asset-movements', createAssetMovement)
  app.patch('/asset-movements/:id', updateAssetMovementController)
  app.get('/asset-movements/:id', getAssetMovementController)
}
