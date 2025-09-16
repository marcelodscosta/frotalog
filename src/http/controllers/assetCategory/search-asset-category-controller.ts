import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeSearchAssetCategory } from '../../../services/factories/make-search-asset-category'

const searchAssetCategorySchema = z.object({
  query: z.string().min(1),
  page: z.coerce.number().default(1),
})

type QueryParams = z.infer<typeof searchAssetCategorySchema>

export async function SearchAssetCategory(
  request: FastifyRequest<{ Querystring: QueryParams }>,
  reply: FastifyReply,
) {
  try {
    const { query, page } = searchAssetCategorySchema.parse(request.query)

    const searchAssetCategoryUseCase = makeSearchAssetCategory()
    const assetCategories = await searchAssetCategoryUseCase.execute({
      query,
      page,
    })

    return reply.status(200).send(assetCategories)
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : error,
    })
  }
}
