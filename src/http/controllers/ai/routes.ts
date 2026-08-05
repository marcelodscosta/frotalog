import { FastifyInstance } from 'fastify'
import { analyzePricing } from './pricing-analysis'
import { authMiddleware } from '../../middleware/auth'

export async function aiRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)
  
  app.post('/ai/pricing-analysis', analyzePricing)
}
