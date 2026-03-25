import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteCommercialProposal } from '../../../services/factories/make-delete-commercial-proposal'

export async function deleteCommercialProposal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteParamsSchema.parse(request.params)

  const deleteCommercialProposalUseCase = makeDeleteCommercialProposal()

  await deleteCommercialProposalUseCase.execute({ id })

  return reply.status(204).send()
}
