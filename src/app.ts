import fastify from 'fastify'
import { assetCategoryRoutes } from './http/controllers/assetCategory/routes'
import { ZodError, z } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(assetCategoryRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: z.treeifyError(error),
    })
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return reply
      .status(error.statusCode)
      .send({ message: error.message || 'Error' })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: logar em ferramenta externa (Sentry, Datadog etc.)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
