import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchServiceCategory } from '../../../services/factories/make-search-service-category'

export async function searchServiceCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchServiceCategorySchema = z.object({
    query: z.string().min(1),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchServiceCategorySchema.parse(request.query)

  const searchServiceCategoryUseCase = makeSearchServiceCategory()

  const result = await searchServiceCategoryUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send(result)
}
