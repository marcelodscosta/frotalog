import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateServiceCategory } from '../../../services/factories/make-create-service-category'

export async function createServiceCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createServiceCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
  })

  const { name, description } = createServiceCategorySchema.parse(request.body)

  const createServiceCategoryUseCase = makeCreateServiceCategory()

  const result = await createServiceCategoryUseCase.execute({
    name,
    description,
  })

  return reply.status(201).send(result)
}
