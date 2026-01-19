import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAllServiceCategory } from '../../../services/factories/make-find-all-service-category'

export async function findAllServiceCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findAllServiceCategorySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = findAllServiceCategorySchema.parse(request.query)

  const findAllServiceCategoryUseCase = makeFindAllServiceCategory()

  const result = await findAllServiceCategoryUseCase.execute({ page })

  return reply.status(200).send(result)
}
