import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchAssetMovementsByAsset } from '../../../services/factories/make-fetch-asset-movements-by-asset'

export async function fetchAssetMovementsByAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    assetId: z.string(),
  })

  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { assetId } = fetchParamsSchema.parse(request.params)
  const { page } = fetchQuerySchema.parse(request.query)

  const fetchAssetMovementsByAssetUseCase = makeFetchAssetMovementsByAsset()

  const { assetMovements } = await fetchAssetMovementsByAssetUseCase.execute({
    assetId,
    page,
  })

  return reply.status(200).send(assetMovements)
}
