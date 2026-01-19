import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindServiceCategoryById } from '../../../services/factories/make-find-service-category-by-id'

export async function findServiceCategoryById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findServiceCategoryByIdSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = findServiceCategoryByIdSchema.parse(request.params)

  const findServiceCategoryByIdUseCase = makeFindServiceCategoryById()

  const result = await findServiceCategoryByIdUseCase.execute({ id })

  return reply.status(200).send(result)
}
