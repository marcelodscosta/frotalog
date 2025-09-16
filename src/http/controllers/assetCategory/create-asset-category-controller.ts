import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeCreateAssetCategory } from '../../../services/factories/make-create-asset-category'

export async function createAssetCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    name: z.string().min(6),
    description: z.string().optional(),
    type: z.enum(['VEHICLE', 'EQUIPMENT']),
  })

  const { name, description, type } = createBodySchema.parse(request.body)

  try {
    const createAssetCategoryUseCase = makeCreateAssetCategory()
    await createAssetCategoryUseCase.execute({
      name,
      description: description ?? '',
      type,
    })
    return reply.status(201).send()
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    })
  }
}
