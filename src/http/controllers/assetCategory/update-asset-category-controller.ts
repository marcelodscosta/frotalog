import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateAssetCategory } from '../../../services/factories/make-update-asset-category'

const updateBodySchema = z.object({
  name: z.string().min(6).optional(),
  description: z.string().optional(),
  type: z.enum(['VEHICLE', 'EQUIPMENT']).optional(),
  is_Active: z.boolean().optional(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateAssetCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.query)
  const data = updateBodySchema.parse(request.body)

  const updateAssetCategoryUseCase = makeUpdateAssetCategory()
  const { assetCategory } = await updateAssetCategoryUseCase.execute({
    id,
    data,
  })
  return reply.status(200).send(assetCategory)
}
