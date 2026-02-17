import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMeasurementBulletin } from '../../../services/factories/make-get-measurement-bulletin'

export async function getMeasurementBulletin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const useCase = makeGetMeasurementBulletin()
  const { measurementBulletin } = await useCase.execute({ id })

  return reply.status(200).send({ measurementBulletin })
}
