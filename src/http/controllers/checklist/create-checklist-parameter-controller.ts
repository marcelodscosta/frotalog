import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateChecklistParameter } from '../../../services/factories/make-create-checklist-parameter'

export async function createChecklistParameterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    items: z.array(
      z.object({
        description: z.string().min(1),
        order: z.number().int().min(0),
        requiresPhoto: z.boolean(),
      }),
    ),
  })

  const data = bodySchema.parse(request.body)
  const useCase = makeCreateChecklistParameter()
  const { parameter } = await useCase.execute(data)

  return reply.status(201).send({ parameter })
}
