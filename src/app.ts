import fastify from 'fastify'
import { assetCategoryRoutes } from './http/controllers/assetCategory/routes'
import { ZodError, z } from 'zod'
import { env } from './env'
import { assetRoutes } from './http/controllers/asset/routes'
import { AppError } from './services/errors/app-error'
import { supplierRoutes } from './http/controllers/supplier/routes'
import { userRoutes } from './http/controllers/user/routes'
import { maintenanceRoutes } from './http/controllers/maintenance/routes'
import { maintenanceDocumentRoutes } from './http/controllers/maintenance-document/routes'
import { authRoutes } from './http/controllers/auth/routes'
import { reportsRoutes } from './http/controllers/reports/routes'
import { dashboardRoutes } from './http/controllers/dashboard/routes'

import fastifyCors from '@fastify/cors'
import { serviceCategoryRoutes } from './http/controllers/serviceCategory/routes'
import { contractRoutes } from './http/controllers/contract/routes'
import { assetMovementRoutes } from './http/controllers/asset-moviment/routes'
import { measurementBulletinRoutes } from './http/controllers/measurement-bulletin/routes'
import { bulletinExpenseRoutes } from './http/controllers/measurement-bulletin/bulletin-expense-routes'
import { invoiceRoutes } from './http/controllers/invoice/routes'
import { companySettingsRoutes } from './http/controllers/company-settings/routes'
import { operationalRoutes } from './http/controllers/operational/routes'

export const app = fastify({
  logger:
    env.NODE_ENV === 'test'
      ? false
      : {
          level: env.NODE_ENV === 'dev' ? 'debug' : 'info',
          transport:
            env.NODE_ENV === 'dev'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
        },
})

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'node:path'

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})
app.register(fastifyStatic, {
  root: path.resolve(process.cwd(), 'uploads'),
  prefix: '/uploads/',
})

app.register(authRoutes)
app.register(assetCategoryRoutes)
app.register(assetRoutes)
app.register(supplierRoutes)
app.register(userRoutes)
app.register(maintenanceRoutes)
app.register(maintenanceDocumentRoutes)
app.register(reportsRoutes)
app.register(dashboardRoutes)
app.register(serviceCategoryRoutes)
app.register(contractRoutes)
app.register(assetMovementRoutes)
app.register(measurementBulletinRoutes)
app.register(bulletinExpenseRoutes)
app.register(invoiceRoutes)
app.register(companySettingsRoutes)
app.register(operationalRoutes)

app.setErrorHandler((error, request, reply) => {
  const requestId = request.id
  const { method, url } = request

  if (error instanceof ZodError) {
    request.log.warn(
      {
        requestId,
        method,
        url,
        error: 'Validation error',
        issues: z.treeifyError(error),
      },
      'Validation error occurred',
    )

    return reply.status(400).send({
      message: 'Validation error.',
      issues: z.treeifyError(error),
    })
  }

  if (error instanceof AppError) {
    request.log.warn(
      {
        requestId,
        method,
        url,
        error: error.message,
        statusCode: error.statusCode,
      },
      'Application error occurred',
    )

    return reply.status(error.statusCode).send({
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  request.log.error(
    {
      requestId,
      method,
      url,
      error: error.message,
      stack: error.stack,
    },
    'Unexpected error occurred',
  )

  return reply.status(500).send({
    message: 'Internal server error',
    requestId,
  })
})
