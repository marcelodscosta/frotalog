import { FastifyInstance } from 'fastify'
import { createSupplier } from '../supplier/create-supplier-controller'

export async function supplierRoutes(app: FastifyInstance) {
  app.post('/supplier', createSupplier)
}
