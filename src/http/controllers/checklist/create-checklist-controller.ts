import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateChecklist } from '../../../services/factories/make-create-checklist'

export async function createChecklistController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    checklistParameterId: z.string().uuid(),
    assetId: z.string().uuid(),
    type: z.enum(['MOBILIZATION', 'PERIODIC', 'DEMOBILIZATION']),
    supplierId: z.string().uuid().optional(),
  })

  const data = bodySchema.parse(request.body)
  const useCase = makeCreateChecklist()
  const { checklist } = await useCase.execute(data)

  return reply.status(201).send({ checklist })
}
