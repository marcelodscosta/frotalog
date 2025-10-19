import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate-controller'
import { register } from './register-controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', authenticate)
  app.post('/auth/register', register)
}
