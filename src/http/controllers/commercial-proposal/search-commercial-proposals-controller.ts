import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchCommercialProposals } from '../../../services/factories/make-search-commercial-proposals'

export async function searchCommercialProposals(request: FastifyRequest, reply: FastifyReply) {
  const searchParamsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).default(10),
    query: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED']).optional(),
    clientId: z.string().optional(),
  })

  const { page, pageSize, query, status, clientId } = searchParamsSchema.parse(request.query)

  const searchProposalsUseCase = makeSearchCommercialProposals()

  const result = await searchProposalsUseCase.execute({
    page,
    pageSize,
    query,
    status,
    clientId,
  })

  return reply.status(200).send(result)
}
