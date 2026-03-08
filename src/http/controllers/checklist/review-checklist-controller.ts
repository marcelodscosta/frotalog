import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeReviewChecklist } from '../../../services/factories/make-review-checklist'

export async function reviewChecklistController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const bodySchema = z.object({
    approved: z.boolean(),
    rejectionNotes: z.string().optional(),
  })

  const { approved, rejectionNotes } = bodySchema.parse(request.body)

  // Get reviewer info from auth (userId in the token)
  const reviewedBy = (request as any).userId || 'unknown'

  const useCase = makeReviewChecklist()
  const { checklist } = await useCase.execute({
    checklistId: id,
    approved,
    rejectionNotes,
    reviewedBy,
  })

  return reply.status(200).send({ checklist })
}
