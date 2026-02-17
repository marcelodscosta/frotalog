import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateMeasurementBulletin } from '../../../services/factories/make-create-measurement-bulletin'

export async function createMeasurementBulletin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    contractId: z.string().uuid(),
    assetMovementId: z.string().uuid(),
    reference_start: z.coerce.date(),
    reference_end: z.coerce.date(),
    notes: z.string().optional().nullable(),
  })

  const data = bodySchema.parse(request.body)
  const useCase = makeCreateMeasurementBulletin()
  const { measurementBulletin } = await useCase.execute(data)

  return reply.status(201).send({ measurementBulletin })
}
