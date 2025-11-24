import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetDashboardStats } from '../../../services/factories/make-get-dashboard-stats'

export async function getDashboardStats(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getDashboardStatsUseCase = makeGetDashboardStats()
  const stats = await getDashboardStatsUseCase.execute()

  return reply.status(200).send(stats)
}

