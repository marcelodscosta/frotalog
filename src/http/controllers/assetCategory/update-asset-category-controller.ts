import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateAssetCategory } from '../../../services/factories/make-update-asset-category'

export async function updateAssetCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBodySchema = z.object({
    name: z.string().min(6).optional(),
    description: z.string().optional(),
    type: z.enum(['VEHICLE', 'EQUIPMENT']).optional(),
    is_Active: z.boolean().optional(),
  })

  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = updateParamsSchema.parse(request.params)
  const data = updateBodySchema.parse(request.body)

  try {
    const updateAssetCategoryUseCase = makeUpdateAssetCategory()
    const { assetCategory } = await updateAssetCategoryUseCase.execute({
      id,
      data,
    })
    return reply.status(200).send(assetCategory)
  } catch (error) {
    if (error instanceof Error && error.message === 'AssetCategory not found') {
      return reply.status(404).send({
        message: 'AssetCategory not found',
      })
    }
    return reply.status(500).send({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    })
  }
}
