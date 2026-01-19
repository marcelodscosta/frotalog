import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateServiceCategoryIsActive } from '../../../services/factories/make-update-service-category-is-active'

export async function updateServiceCategoryIsActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateServiceCategoryIsActiveParamsSchema = z.object({
    id: z.string(),
  })

  const updateServiceCategoryIsActiveBodySchema = z.object({
    is_active: z.boolean(),
  })
  console.log(`Meu request.body: ${request.body}`)
  const { id } = updateServiceCategoryIsActiveParamsSchema.parse(request.params)
  const { is_active } = updateServiceCategoryIsActiveBodySchema.parse(
    request.body,
  )

  const updateServiceCategoryIsActiveUseCase =
    makeUpdateServiceCategoryIsActive()

  await updateServiceCategoryIsActiveUseCase.execute({
    id,
    is_active,
  })

  return reply.status(204).send()
}
