import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { createAssetReading } from './create-asset-reading-controller'
import { getAssetReadings } from './get-asset-readings-controller'

export async function operationalRoutes(app: FastifyInstance) {
  app.addHook('onRequest', requireAuth())

  app.post('/operational/readings', createAssetReading)
  app.get('/operational/readings', getAssetReadings)
}
