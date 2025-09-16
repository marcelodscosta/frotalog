import { FastifyInstance } from 'fastify'
import { createAssetCategory } from './create-asset-category-controller'
import { getAssetCategoryById } from './get-asset-category-by-id-controller'
import { SearchAssetCategory } from './search-asset-category-controller'
import { updateAssetCategory } from './update-asset-category-controller'

export async function assetCategoryRoutes(app: FastifyInstance) {
  app.post('/assetCategories', createAssetCategory)
  app.get('/assetCategories/:id', getAssetCategoryById)
  app.patch('/assetCategories/:id', updateAssetCategory)
  app.get('/assetCategories/search', SearchAssetCategory)
}
