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
    assetId: z.string().uuid().optional(),
    status: z.enum(['DRAFT', 'APPROVED', 'INVOICED']).optional(),
  })

  const { page, contractId, assetId, status } = querySchema.parse(request.query)
  const useCase = makeFetchMeasurementBulletins()
  const { bulletins } = await useCase.execute({ contractId, assetId, status, page })

  return reply.status(200).send(bulletins)
}
