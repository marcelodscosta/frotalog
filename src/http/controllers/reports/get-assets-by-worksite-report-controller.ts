import { FastifyRequest, FastifyReply } from 'fastify'
import { AssetsByWorksiteReport } from '../../../services/reports/assets-by-worksite-report'

export async function getAssetsByWorksiteReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const service = new AssetsByWorksiteReport()
  const data = await service.execute()

  return reply.send(data)
}
