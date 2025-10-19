import { FastifyInstance } from 'fastify'
import { createSupplier } from '../supplier/create-supplier-controller'
import { getSupplierById } from './get-supplier-by-id-controller'
import { updateSupplier } from './update-supplier-controller'
import { findSupplierByCompanyName } from './find-supplier-by-company-name-controller'
import { findAllSupplier } from './find-all-supplier-controller'
import { requireAuth } from '../../middleware/auth'

export async function supplierRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de fornecedores
  app.addHook('preHandler', requireAuth())
  
  app.post('/supplier', createSupplier)
  app.get('/supplier/search/:id', getSupplierById)
  app.patch('/supplier/:id', updateSupplier)
  app.get('/supplier/search/companyName', findSupplierByCompanyName)
  app.get('/supplier/search/findAll', findAllSupplier)
}
