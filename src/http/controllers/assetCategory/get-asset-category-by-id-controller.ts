import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetAssetCategoryById } from '../../../services/factories/make-get-asset-category-by-id'
import { AssetCategoryNotFoundError } from '../../../services/errors/asset-category-not-found-error'

const getAssetCategoryByIdSchema = z.object({
  id: z.string(),
})

export async function getAssetCategoryById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = getAssetCategoryByIdSchema.parse(request.params)

  const getAssetCategoryUseCase = makeGetAssetCategoryById()
  const { assetCategory } = await getAssetCategoryUseCase.execute({ id })

  if (!assetCategory) {
    throw new AssetCategoryNotFoundError()
  }
  return reply.status(200).send(assetCategory)
}
