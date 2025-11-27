import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateAssetIsActiveStatus } from '../../../services/factories/make-update-asset-is-active-status'

const updateBodySchema = z.object({
  is_Active: z.boolean(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateAssetActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.params)

  const { is_Active } = updateBodySchema.parse(request.body)

  const updateAssetIsActiveStatusUseCase = makeUpdateAssetIsActiveStatus()
  const { asset } = await updateAssetIsActiveStatusUseCase.execute({
    id,
    data: is_Active,
  })
  return reply.status(200).send(asset)
}
