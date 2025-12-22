import { FastifyInstance } from 'fastify'
import { createSupplier } from '../supplier/create-supplier-controller'
import { getSupplierById } from './get-supplier-by-id-controller'
import { updateSupplier } from './update-supplier-controller'
import { findSupplierByCompanyName } from './find-supplier-by-company-name-controller'
import { findAllSupplier } from './find-all-supplier-controller'
import { findSupplierByServiceType } from './find-supplier-by-service-type-controller' // importe o controller novo
import { requireAuth } from '../../middleware/auth'
import { updateSupplierActive } from './update-supplier-active-status-controller'
import { findAllSupplierUnpaginated } from './find-all-supplier-unpaginated-controller'

export async function supplierRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de fornecedores
  app.addHook('preHandler', requireAuth())

  app.post('/supplier', createSupplier)
  app.get('/supplier/search/:id', getSupplierById)
  app.patch('/supplier/:id', updateSupplier)
  app.patch('/supplier/:id/active', updateSupplierActive)
  app.get('/supplier/search/companyName', findSupplierByCompanyName)
  app.get('/supplier/search/findAll', findAllSupplier)
  app.get('/supplier/search/findAll/unpaginated', findAllSupplierUnpaginated)

  // Rota adicionada para buscar por tipo de serviço
  app.get('/supplier/search/serviceType', findSupplierByServiceType)
}
