import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetChecklistByMagicLink } from '../../../services/factories/make-get-checklist-by-magic-link'

export async function getChecklistByMagicLinkController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({ magicLinkId: z.string().uuid() })
  const { magicLinkId } = paramsSchema.parse(request.params)

  const useCase = makeGetChecklistByMagicLink()
  const { checklist } = await useCase.execute(magicLinkId)

  return reply.status(200).send({ checklist })
}
