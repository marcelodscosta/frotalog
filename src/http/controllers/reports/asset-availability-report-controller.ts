import { FastifyReply, FastifyRequest } from 'fastify'
import { AssetAvailabilityReportUseCase } from '../../../services/reports/asset-availability-report'

export async function getAssetAvailabilityReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = new AssetAvailabilityReportUseCase()

  const report = await useCase.execute()

  return reply.status(200).send({ report })
}
