import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { getCompanySettings } from './get-company-settings-controller'
import { upsertCompanySettings } from './upsert-company-settings-controller'
import { uploadLogo } from './upload-logo-controller'

export async function companySettingsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.get('/company-settings', getCompanySettings)
  app.put('/company-settings', upsertCompanySettings)
  app.post('/company-settings/logo', uploadLogo)
}
