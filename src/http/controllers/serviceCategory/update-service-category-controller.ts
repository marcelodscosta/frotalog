import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateServiceCategory } from '../../../services/factories/make-update-service-category'

export async function updateServiceCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateServiceCategoryParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateServiceCategoryBodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  })

  const { id } = updateServiceCategoryParamsSchema.parse(request.params)
  const { name, description } = updateServiceCategoryBodySchema.parse(
    request.body,
  )

  const updateServiceCategoryUseCase = makeUpdateServiceCategory()

  await updateServiceCategoryUseCase.execute({
    id,
    name,
    description,
  })

  return reply.status(204).send()
}
