import { FastifyInstance } from 'fastify'
import { createAssetMovement } from './create-asset-movement-controller'
import { requireAuth } from '../../middleware/auth'
import { updateAssetMovementController } from './update-asset-movement-controller'
import { getAssetMovementController } from './get-asset-movement-controller'
import { deleteAssetMovement } from './delete-asset-movement-controller'
import { fetchAssetMovements } from './fetch-asset-movements-controller'
import { fetchAssetMovementsByContract } from './fetch-asset-movements-by-contract-controller'
import { fetchAssetMovementsByAsset } from './fetch-asset-movements-by-asset-controller'
import { searchAssetMovements } from './search-asset-movements-controller'
import { updateBillingCycle } from './update-billing-cycle-controller'
import { updateMovementDates } from './update-movement-dates-controller'
import { getAssetMovementsSummaryByContract } from './get-asset-movements-summary-by-contract-controller'
import { getActiveMovementsByAsset } from './get-active-movements-by-asset-controller'
import { getAssetMovementWithDetails } from './get-asset-movement-with-details-controller'
import { fetchAssetMovementsUnpaginated } from './fetch-asset-movements-unpaginated-controller'

export async function assetMovementRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  app.post('/asset-movements', createAssetMovement)
  app.get('/asset-movements', fetchAssetMovements)
  app.get('/asset-movements/unpaginated', fetchAssetMovementsUnpaginated)
  app.get('/asset-movements/search', searchAssetMovements)
  app.get('/asset-movements/:id', getAssetMovementController)
  app.get('/asset-movements/:id/details', getAssetMovementWithDetails)
  app.patch('/asset-movements/:id', updateAssetMovementController)
  app.patch('/asset-movements/:id/billing-cycle', updateBillingCycle)
  app.patch('/asset-movements/:id/dates', updateMovementDates)
  app.delete('/asset-movements/:id', deleteAssetMovement)


  app.get('/contracts/:contractId/asset-movements', fetchAssetMovementsByContract)
  app.get(
    '/contracts/:contractId/asset-movements/summary',
    getAssetMovementsSummaryByContract,
  )
  app.get('/assets/:assetId/asset-movements', fetchAssetMovementsByAsset)
  app.get('/assets/:assetId/asset-movements/active', getActiveMovementsByAsset)
}
