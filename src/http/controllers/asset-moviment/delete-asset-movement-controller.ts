import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteAssetMovement } from '../../../services/factories/make-delete-asset-movement'

export async function deleteAssetMovement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteParamsSchema.parse(request.params)

  const deleteAssetMovementUseCase = makeDeleteAssetMovement()

  await deleteAssetMovementUseCase.execute({
    id,
  })

  return reply.status(204).send()
}
