import fastify from 'fastify'
import { assetCategoryRoutes } from './http/controllers/assetCategory/routes'
import { ZodError, z } from 'zod'
import { env } from './env'
import { assetRoutes } from './http/controllers/asset/routes'
import { AppError } from './services/errors/app-error'

export const app = fastify()

app.register(assetCategoryRoutes)
app.register(assetRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: z.treeifyError(error),
    })
  }
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: logar em ferramenta externa (Sentry, Datadog etc.)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
