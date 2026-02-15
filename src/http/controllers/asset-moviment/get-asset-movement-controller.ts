import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetAssetMovement } from '../../../services/factories/make-get-asset-movement'

export async function getAssetMovementController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getParamsSchema.parse(request.params)

  const getAssetMovementUseCase = makeGetAssetMovement()

  const { assetMovement } = await getAssetMovementUseCase.execute({
    id,
  })

  return reply.status(200).send({ assetMovement })
}
