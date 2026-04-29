import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { getCompanySettings } from './get-company-settings-controller'
import { upsertCompanySettings } from './upsert-company-settings-controller'
import { uploadLogo } from './upload-logo-controller'

export async function companySettingsRoutes(app: FastifyInstance) {
  app.get('/company-settings', getCompanySettings)
  
  app.put('/company-settings', { preHandler: [requireAuth()] }, upsertCompanySettings)
  app.post('/company-settings/logo', { preHandler: [requireAuth()] }, uploadLogo)
}
