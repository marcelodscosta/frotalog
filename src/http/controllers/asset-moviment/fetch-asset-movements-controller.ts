import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchAssetMovements } from '../../../services/factories/make-fetch-asset-movements'

export async function fetchAssetMovements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchQuerySchema.parse(request.query)

  const fetchAssetMovementsUseCase = makeFetchAssetMovements()

  const { assetMovements } = await fetchAssetMovementsUseCase.execute({
    page,
  })

  return reply.status(200).send(assetMovements)
}
