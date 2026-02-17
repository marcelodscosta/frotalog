import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchMeasurementBulletins } from '../../../services/factories/make-fetch-measurement-bulletins'

export async function fetchMeasurementBulletins(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.coerce.number().default(1),
    contractId: z.string().uuid().optional(),
  })

  const { page, contractId } = querySchema.parse(request.query)
  const useCase = makeFetchMeasurementBulletins()
  const { bulletins } = await useCase.execute({ contractId, page })

  return reply.status(200).send(bulletins)
}
