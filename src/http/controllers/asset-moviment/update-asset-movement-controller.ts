import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateAssetMovement } from '../../../services/factories/make-update-asset-movement'

export async function updateAssetMovementController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    mobilization_date: z.coerce.date().optional(),
    integration_date: z.coerce.date().optional(),
    demobilization_date: z.coerce.date().optional(),
    mobilization_checklist_url: z.url().nullable().optional(),
    demobilization_checklist_url: z.url().nullable().optional(),
    rental_value: z.number().positive().optional(),
    billing_cycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
    operator_name: z.string().nullable().optional(),
    current_horometer: z.number().nullable().optional(),
    current_odometer: z.number().nullable().optional(),
    delivery_location: z.string().nullable().optional(),
    freight_value: z.number().nonnegative().nullable().optional(),
    notes: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
  })

  const { id } = updateParamsSchema.parse(request.params)
  const data = updateBodySchema.parse(request.body)

  const updateAssetMovementUseCase = makeUpdateAssetMovement()

  const { assetMovement } = await updateAssetMovementUseCase.execute({
    id,
    data,
  })

  return reply.status(200).send({ assetMovement })
}
