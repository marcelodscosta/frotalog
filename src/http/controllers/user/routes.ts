import { FastifyInstance } from 'fastify'
import { createUser } from './create-user-controller'
import { findAllUsers } from './find-all-user-controller'
import { getUserById } from './get-user-by-id-controller'
import { getUserByEmail } from './get-user-by-email-controller'
import { searchUserByName } from './search-user-by-name-controller'
import { getUserByRole } from './get-user-by-role-controller'
import { updateUser } from './update-user-controller'
import { toggleUserStatus } from './toggle-user-status-controller'
import { requireAuth, requireAdmin } from '../../middleware/auth'

export async function userRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de usuários
  app.addHook('preHandler', requireAuth())

  app.post('/user', createUser)
  app.get('/user/search', findAllUsers)
  app.get('/user/search/:id', getUserById)
  app.get('/user/search/email', getUserByEmail)
  app.get('/user/search/name', searchUserByName)
  app.get('/user/search/role', getUserByRole)
  app.patch('/user/:id', updateUser)

  // Rota que requer permissão de admin
  app.patch(
    '/user/:id/status',
    { preHandler: requireAdmin() },
    toggleUserStatus,
  )
}
