import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteChecklist } from '../../../services/factories/make-delete-checklist'

export async function deleteChecklistController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const useCase = makeDeleteChecklist()
  await useCase.execute(id)

  return reply.status(204).send()
}
