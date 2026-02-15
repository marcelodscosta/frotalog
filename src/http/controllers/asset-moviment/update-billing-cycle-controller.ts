import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateBillingCycle } from '../../../services/factories/make-update-billing-cycle'

export async function updateBillingCycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    billing_cycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  })

  const { id } = updateParamsSchema.parse(request.params)
  const { billing_cycle } = updateBodySchema.parse(request.body)

  const updateBillingCycleUseCase = makeUpdateBillingCycle()

  const { assetMovement } = await updateBillingCycleUseCase.execute({
    id,
    billingCycle: billing_cycle,
  })

  return reply.status(200).send({ assetMovement })
}
