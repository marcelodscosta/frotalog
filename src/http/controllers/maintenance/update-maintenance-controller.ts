import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateMaintenance } from '../../../services/factories/make-update-maintenance'

export async function updateMaintenance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const moneyPreprocess = z.preprocess((val) => {
    if (val === null || val === undefined || val === '') return null
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const normalized = val.replace(/\./g, '').replace(',', '.')
      const num = Number(normalized)
      return Number.isNaN(num) ? null : num
    }
    return null
  }, z.number().min(0))

  const bodySchema = z.object({
    assetId: z.string().optional(),
    supplierId: z.string().optional(),
    serviceCategoryId: z.string().nullable().optional(),

    type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']).optional(),
    description: z.string().min(5).optional(),

    scheduled_date: z
      .string()
      .optional()
      .transform((val) => {
        if (!val || val === 'null') return undefined
        const date = new Date(val)
        return isNaN(date.getTime()) ? undefined : date.toISOString()
      }),

    started_date: z
      .string()
      .optional()
      .transform((str) => {
        if (!str) return undefined
        const date = new Date(str)
        return isNaN(date.getTime()) ? undefined : date.toISOString()
      }),

    completed_date: z
      .string()
      .optional()
      .transform((str) => {
        if (!str) return undefined
        const date = new Date(str)
        return isNaN(date.getTime()) ? undefined : date.toISOString()
      }),

    actual_cost: moneyPreprocess.optional(),
    estimated_cost: moneyPreprocess.optional(),

    notes: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined
        const trimmed = val?.trim() ?? ''
        return trimmed === '' ? null : trimmed
      }),
  })

  const { id } = paramsSchema.parse(request.params)
  const parseResult = bodySchema.safeParse(request.body)

  if (!parseResult.success) {
    console.error('ZOD ERROR:', parseResult.error.format())
    return reply.status(400).send({
      message: 'Validation error.',
      issues: parseResult.error.format(),
    })
  }

  const { serviceCategoryId, ...data } = parseResult.data

  const updateMaintenance = makeUpdateMaintenance()
  const { maintenance } = await updateMaintenance.execute({
    id,
    data,
    serviceCategoryId,
  })

  return reply.status(200).send({ maintenance })
}
