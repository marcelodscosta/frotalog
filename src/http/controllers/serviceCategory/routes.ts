import { FastifyInstance } from 'fastify'
import { createServiceCategory } from './create-service-category-controller'
import { findServiceCategoryById } from './find-service-category-by-id-controller'
import { searchServiceCategory } from './search-service-category-controller'
import { findAllServiceCategory } from './find-all-service-category-controller'
import { findAllServiceCategoryUnpaginated } from './find-all-service-category-unpaginated-controller'
import { updateServiceCategory } from './update-service-category-controller'
import { updateServiceCategoryIsActive } from './update-service-category-is-active-controller'
import { requireAuth } from '../../middleware/auth'

export async function serviceCategoryRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de categorias de serviço
  app.addHook('preHandler', requireAuth())

  app.post('/service-category', createServiceCategory)
  app.get('/service-category/search', searchServiceCategory)
  app.get('/service-categories', findAllServiceCategory)
  app.get(
    '/service-category/all/unpaginated',
    findAllServiceCategoryUnpaginated,
  )
  app.get('/service-category/:id', findServiceCategoryById)
  app.patch('/service-category/:id', updateServiceCategory)
  app.patch('/service-category/:id/status', updateServiceCategoryIsActive)
}
