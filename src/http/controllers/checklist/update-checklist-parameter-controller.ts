import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateChecklistParameter } from '../../../services/factories/make-update-checklist-parameter'

export async function updateChecklistParameterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    items: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          description: z.string().min(1),
          order: z.number().int().min(0),
          requiresPhoto: z.boolean(),
        }),
      )
      .optional(),
  })

  const data = bodySchema.parse(request.body)
  const useCase = makeUpdateChecklistParameter()
  const { parameter } = await useCase.execute({ id, ...data })

  return reply.status(200).send({ parameter })
}
