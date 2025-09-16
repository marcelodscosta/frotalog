import fastify from 'fastify'
import { assetCategoryRoutes } from './http/controllers/assetCategory/routes'

export const app = fastify()

app.register(assetCategoryRoutes)
