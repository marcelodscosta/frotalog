import { FastifyInstance } from 'fastify'
import { sendMessage } from './send-message'
import { authMiddleware } from '../../middleware/auth'

export async function chatRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)
  app.post('/chat', sendMessage)
}
