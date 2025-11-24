import { FastifyInstance } from 'fastify'
import { createAsset } from './create-asset-controller'
import { findAllAssets } from './find-all-asset-controller'
import { getAssetByBrand } from './get-asset-by-brand-controller'
import { getAssetById } from './get-asset-by-id-controller'
import { getAssetByModel } from './get-asset-by-model-controller'
import { getAssetByPlate } from './get-asset-by-plate-controller'
import { getAssetBySerialNumber } from './get-asset-by-serial-number-controller'
import { updateAsset } from './update-asset-controller'
import { requireAuth } from '../../middleware/auth'

export async function assetRoutes(app: FastifyInstance) {
  // Aplicar autenticação em todas as rotas de ativos
  app.addHook('preHandler', requireAuth())

  app.post('/asset', createAsset)
  app.get('/asset/search', findAllAssets)
  app.get('/asset/search/brand', getAssetByBrand)
  app.get('/asset/search/model', getAssetByModel)
  app.get('/asset/search/:id', getAssetById)
  app.get('/asset/search/plate/:plate', getAssetByPlate)
  app.get('/asset/search/serialNumber/:serialNumber', getAssetBySerialNumber)
  app.patch('/asset/:id', updateAsset)
}
