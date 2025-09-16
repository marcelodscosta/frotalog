import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetAssetCategoryById } from '../../../services/factories/make-get-asset-category-by-id'

const getAssetCategoryByIdSchema = z.object({
  id: z.string(),
})

type Params = z.infer<typeof getAssetCategoryByIdSchema>

export async function getAssetCategoryById(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply,
) {
  const { id } = getAssetCategoryByIdSchema.parse(request.params)
  try {
    const getAssetCategoryUseCase = makeGetAssetCategoryById()
    const assetCategory = await getAssetCategoryUseCase.execute({ id })

    if (!assetCategory) {
      return reply.status(404).send({ message: 'Asset category not found' })
    }

    return reply.status(200).send({ assetCategory })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    })
  }
}
