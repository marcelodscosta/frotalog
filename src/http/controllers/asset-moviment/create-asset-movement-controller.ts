import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateAssetMovement } from '../../../services/factories/make-create-asset-movement'

export async function createAssetMovement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    contractId: z.string(),
    assetId: z.string(),
    mobilization_date: z.coerce.date().optional(),
    integration_date: z.coerce.date().optional(),
    demobilization_date: z.coerce.date().optional(),
    mobilization_checklist_url: z.string().url().nullable().optional(),
    demobilization_checklist_url: z.string().url().nullable().optional(),
    rental_value: z.number().positive(),
    billing_cycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).default('MONTHLY'),
    operator_name: z.string().nullable().optional(),
    current_horometer: z.number().nullable().optional(),
    current_odometer: z.number().nullable().optional(),
    delivery_location: z.string().nullable().optional(),
    freight_value: z.number().nonnegative().nullable().optional(),
    notes: z.string().nullable().optional(),
  })

  const data = createBodySchema.parse(request.body)

  const createAssetMovementUseCase = makeCreateAssetMovement()
  const { assetMovement } = await createAssetMovementUseCase.execute(data)

  return reply.status(201).send({ assetMovement })
}
