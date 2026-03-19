import { FastifyInstance } from 'fastify'
import { genericUploadController } from './generic-upload-controller'

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', genericUploadController)
}
