import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetCommercialProposal } from '../../../services/factories/make-get-commercial-proposal'

export async function getCommercialProposal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getProposalParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getProposalParamsSchema.parse(request.params)
  
  const getProposal = makeGetCommercialProposal()
  const { proposal } = await getProposal.execute({ id })

  return reply.status(200).send({ proposal })
}
