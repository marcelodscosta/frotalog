import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteMeasurementBulletin } from '../../../services/factories/make-delete-measurement-bulletin'

export async function deleteMeasurementBulletin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const useCase = makeDeleteMeasurementBulletin()
  await useCase.execute(id)

  return reply.status(204).send()
}
