import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetActiveMovementsByAsset } from '../../../services/factories/make-get-active-movements-by-asset'

export async function getActiveMovementsByAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    assetId: z.string(),
  })

  const { assetId } = fetchParamsSchema.parse(request.params)

  const getActiveMovementsByAssetUseCase = makeGetActiveMovementsByAsset()

  const { assetMovements } = await getActiveMovementsByAssetUseCase.execute({
    assetId,
  })

  return reply.status(200).send({ assetMovements })
}
