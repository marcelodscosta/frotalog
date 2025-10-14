import { FastifyInstance } from 'fastify'
import { createSupplier } from '../supplier/create-supplier-controller'
import { getSupplierById } from './get-supplier-by-id-controller'
import { updateSupplier } from './update-supplier-controller'

export async function supplierRoutes(app: FastifyInstance) {
  app.post('/supplier', createSupplier)
  app.get('/supplier/search/:id', getSupplierById)
  app.patch('/supplier/:id', updateSupplier)
}
