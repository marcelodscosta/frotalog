import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetDashboardStats } from '../../../services/factories/make-get-dashboard-stats'

export async function getDashboardStats(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    month: z.coerce.number().min(1).max(12).optional(),
    year: z.coerce.number().min(2000).max(2100).optional(),
  })

  const query = querySchema.parse(request.query)
  
  const getDashboardStatsUseCase = makeGetDashboardStats()
  const stats = await getDashboardStatsUseCase.execute({
    startDate: query.startDate,
    endDate: query.endDate,
    month: query.month,
    year: query.year,
  })

  return reply.status(200).send(stats)
}

