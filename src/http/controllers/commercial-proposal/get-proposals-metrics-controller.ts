import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetProposalsMetrics } from '../../../services/factories/make-get-proposals-metrics'

export async function getProposalsMetrics(request: FastifyRequest, reply: FastifyReply) {
  const metricsParamsSchema = z.object({
    query: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED']).optional(),
    clientId: z.string().optional(),
  })

  const { query, status, clientId } = metricsParamsSchema.parse(request.query)

  const getMetricsUseCase = makeGetProposalsMetrics()

  const metrics = await getMetricsUseCase.execute({
    query,
    status,
    clientId,
  })

  return reply.status(200).send(metrics)
}
