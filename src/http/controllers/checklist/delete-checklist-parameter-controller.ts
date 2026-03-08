import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteChecklistParameter } from '../../../services/factories/make-delete-checklist-parameter'

export async function deleteChecklistParameterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const useCase = makeDeleteChecklistParameter()
  await useCase.execute(id)

  return reply.status(204).send()
}
