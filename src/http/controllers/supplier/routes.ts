import { FastifyInstance } from 'fastify'
import { createSupplier } from '../supplier/create-supplier-controller'
import { getSupplierById } from './get-supplier-by-id-controller'
import { updateSupplier } from './update-supplier-controller'
import { findSupplierByCompanyName } from './find-supplier-by-company-name-controller'

export async function supplierRoutes(app: FastifyInstance) {
  app.post('/supplier', createSupplier)
  app.get('/supplier/search/:id', getSupplierById)
  app.patch('/supplier/:id', updateSupplier)
  app.get('/supplier/search/companyName', findSupplierByCompanyName)
}
