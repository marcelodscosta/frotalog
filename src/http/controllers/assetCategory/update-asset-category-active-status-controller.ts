import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateAssetCategoryIsActiveStatus } from '../../../services/factories/make-update-asset-category-is-active-status'

const updateBodySchema = z.object({
  is_Active: z.boolean(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateAssetCategoryActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.params)

  const { is_Active } = updateBodySchema.parse(request.body)

  const updateAssetCategoryIsActiveStatusUseCase =
    makeUpdateAssetCategoryIsActiveStatus()
  const { assetCategory } =
    await updateAssetCategoryIsActiveStatusUseCase.execute({
      id,
      data: is_Active,
    })
  return reply.status(200).send(assetCategory)
}
