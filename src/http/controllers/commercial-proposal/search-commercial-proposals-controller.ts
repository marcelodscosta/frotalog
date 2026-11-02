import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchCommercialProposals } from '../../../services/factories/make-search-commercial-proposals'
import { rejectExpiredProposals } from '../../../services/commercial-proposal/reject-expired-proposals'

export async function searchCommercialProposals(request: FastifyRequest, reply: FastifyReply) {
  const searchParamsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).default(10),
    query: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CANCELLED', 'CONVERTED', 'EXPIRED']).optional(),
    clientId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })

  const { page, pageSize, query, status, clientId, startDate, endDate } = searchParamsSchema.parse(request.query)

  await rejectExpiredProposals().catch((error) => {
    request.log.error(error, 'Falha ao reprovar propostas vencidas')
  })

  const searchProposalsUseCase = makeSearchCommercialProposals()

  const result = await searchProposalsUseCase.execute({
    page,
    pageSize,
    query,
    status,
    clientId,
    startDate,
    endDate,
  })

  return reply.status(200).send(result)
}
