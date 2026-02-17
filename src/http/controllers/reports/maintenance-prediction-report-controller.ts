import { FastifyReply, FastifyRequest } from 'fastify'
import { MaintenancePredictionReport } from '../../../services/reports/maintenance-prediction-report'

export async function getMaintenancePredictionReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const reportService = new MaintenancePredictionReport()

  const report = await reportService.execute()

  return reply.status(200).send({ report })
}
