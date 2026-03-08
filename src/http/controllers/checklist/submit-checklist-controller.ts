import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSubmitChecklist } from '../../../services/factories/make-submit-checklist'

export async function submitChecklistController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ magicLinkId: z.string().uuid() })
  const { magicLinkId } = paramsSchema.parse(request.params)

  const bodySchema = z.object({
    horometer: z.number().nullable().optional(),
    odometer: z.number().nullable().optional(),
    meterPhotoUrl: z.string().nullable().optional(),
    answers: z.array(
      z.object({
        checklistItemTemplateId: z.string().uuid(),
        conforms: z.boolean(),
        notes: z.string().optional(),
        photoUrl: z.string().optional(),
      }),
    ),
  })

  const { answers, horometer, odometer, meterPhotoUrl } = bodySchema.parse(request.body)
  const useCase = makeSubmitChecklist()
  const { checklist } = await useCase.execute({ magicLinkId, answers, horometer, odometer, meterPhotoUrl })

  return reply.status(200).send({ checklist })
}
