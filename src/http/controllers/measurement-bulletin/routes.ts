import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { createMeasurementBulletin } from './create-measurement-bulletin-controller'
import { fetchMeasurementBulletins } from './fetch-measurement-bulletins-controller'
import { getMeasurementBulletin } from './get-measurement-bulletin-controller'
import { updateMeasurementBulletin } from './update-measurement-bulletin-controller'
import { deleteMeasurementBulletin } from './delete-measurement-bulletin-controller'

export async function measurementBulletinRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.post('/measurement-bulletins', createMeasurementBulletin)
  app.get('/measurement-bulletins', fetchMeasurementBulletins)
  app.get('/measurement-bulletins/:id', getMeasurementBulletin)
  app.patch('/measurement-bulletins/:id', updateMeasurementBulletin)
  app.delete('/measurement-bulletins/:id', deleteMeasurementBulletin)
}
