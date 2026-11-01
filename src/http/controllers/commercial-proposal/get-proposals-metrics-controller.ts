import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetProposalsMetrics } from '../../../services/factories/make-get-proposals-metrics'
import { rejectExpiredProposals } from '../../../services/commercial-proposal/reject-expired-proposals'

export async function getProposalsMetrics(request: FastifyRequest, reply: FastifyReply) {
  const metricsParamsSchema = z.object({
    query: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED']).optional(),
    clientId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })

  const { query, status, clientId, startDate, endDate } = metricsParamsSchema.parse(request.query)

  await rejectExpiredProposals().catch((error) => {
    request.log.error(error, 'Falha ao reprovar propostas vencidas')
  })

  const getMetricsUseCase = makeGetProposalsMetrics()

  const metrics = await getMetricsUseCase.execute({
    query,
    status,
    clientId,
    startDate,
    endDate,
  })

  return reply.status(200).send(metrics)
}
