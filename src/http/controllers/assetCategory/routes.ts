import { FastifyInstance } from 'fastify'
import { createAssetCategory } from './create-asset-category-controller'
import { getAssetCategoryById } from './get-asset-category-by-id-controller'
import { SearchAssetCategory } from './search-asset-category-controller'
import { updateAssetCategory } from './update-asset-category-controller'
import { findAllAllAssetCategories } from './find-all-asset-category-controller'

export async function assetCategoryRoutes(app: FastifyInstance) {
  app.post('/assetCategories', createAssetCategory)
  app.patch('/assetCategories/:id', updateAssetCategory)
  app.get('/assetCategories/search', findAllAllAssetCategories)
  app.get('/assetCategories/search/:id', getAssetCategoryById)
  app.get('/assetCategories/search/name', SearchAssetCategory)
}
