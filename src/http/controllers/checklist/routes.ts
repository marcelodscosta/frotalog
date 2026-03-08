import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { createChecklistParameterController } from './create-checklist-parameter-controller'
import { updateChecklistParameterController } from './update-checklist-parameter-controller'
import { fetchChecklistParametersController } from './fetch-checklist-parameters-controller'
import { deleteChecklistParameterController } from './delete-checklist-parameter-controller'
import { createChecklistController } from './create-checklist-controller'
import { fetchChecklistsController } from './fetch-checklists-controller'
import { getChecklistByMagicLinkController } from './get-checklist-by-magic-link-controller'
import { submitChecklistController } from './submit-checklist-controller'
import { uploadChecklistPhotoController } from './upload-checklist-photo-controller'
import { reviewChecklistController } from './review-checklist-controller'
import { deleteChecklistController } from './delete-checklist-controller'

export async function checklistRoutes(app: FastifyInstance) {
  // ── Public routes (magic link – no auth) ──
  app.get('/checklists/magic/:magicLinkId', getChecklistByMagicLinkController)
  app.put('/checklists/magic/:magicLinkId', submitChecklistController)
  app.post('/checklists/magic/:magicLinkId/upload', uploadChecklistPhotoController)

  // ── Authenticated routes ──
  app.register(async (authenticatedApp) => {
    authenticatedApp.addHook('preHandler', requireAuth())

    // Parameters CRUD
    authenticatedApp.post('/checklist-parameters', createChecklistParameterController)
    authenticatedApp.get('/checklist-parameters', fetchChecklistParametersController)
    authenticatedApp.put('/checklist-parameters/:id', updateChecklistParameterController)
    authenticatedApp.delete('/checklist-parameters/:id', deleteChecklistParameterController)

    // Checklists management
    authenticatedApp.post('/checklists', createChecklistController)
    authenticatedApp.get('/checklists', fetchChecklistsController)
    authenticatedApp.patch('/checklists/:id/review', reviewChecklistController)
    authenticatedApp.delete('/checklists/:id', deleteChecklistController)
  })
}
