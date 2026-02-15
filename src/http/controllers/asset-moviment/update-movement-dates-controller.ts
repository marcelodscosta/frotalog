import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateMovementDates } from '../../../services/factories/make-update-movement-dates'

export async function updateMovementDates(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    integrationDate: z.coerce.date().optional(),
    demobilizationDate: z.coerce.date().optional(),
  })

  const { id } = updateParamsSchema.parse(request.params)
  const { integrationDate, demobilizationDate } = updateBodySchema.parse(
    request.body,
  )

  const updateMovementDatesUseCase = makeUpdateMovementDates()

  const { assetMovement } = await updateMovementDatesUseCase.execute({
    id,
    integrationDate,
    demobilizationDate,
  })

  return reply.status(200).send({ assetMovement })
}
