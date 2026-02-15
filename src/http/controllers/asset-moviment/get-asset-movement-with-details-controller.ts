import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetAssetMovementWithDetails } from '../../../services/factories/make-get-asset-movement-with-details'

export async function getAssetMovementWithDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = fetchParamsSchema.parse(request.params)

  const getAssetMovementWithDetailsUseCase = makeGetAssetMovementWithDetails()

  const { assetMovement } = await getAssetMovementWithDetailsUseCase.execute({
    id,
  })

  return reply.status(200).send({ assetMovement })
}
