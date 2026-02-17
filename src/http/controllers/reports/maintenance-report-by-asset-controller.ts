// controllers/maintenance/maintenance-report-by-asset-controller.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeMaintenanceByAssetUseCase } from '../../../services/factories/make-maintenance-by-asset-use-case'

const querySchema = z.object({
  assetId: z.string(),
  startDate: z.string().transform((val) => {
    let date = new Date(val)
    if (isNaN(date.getTime())) {
       // Tenta adicionar tempo se falhar (caso seja apenas YYYY-MM-DD)
       date = new Date(val + 'T00:00:00.000Z')
    }
    // Garante UTC-00:00:00
    date.setUTCHours(0, 0, 0, 0)
    return date
  }),
  endDate: z.string().transform((val) => {
    let date = new Date(val)
    if (isNaN(date.getTime())) {
       date = new Date(val + 'T23:59:59.999Z')
    }
    // Garante UTC-23:59:59
    date.setUTCHours(23, 59, 59, 999)
    return date
  }),
})

export async function maintenanceReportByAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log(`🔍 Query recebida: ${JSON.stringify(request.query)}`)

  const { assetId, startDate, endDate } = querySchema.parse(request.query)

  const maintenanceByAssetUseCase = makeMaintenanceByAssetUseCase()

  const result = await maintenanceByAssetUseCase.execute({
    assetId,
    startDate,
    endDate,
  })

  return reply.status(200).send(result)
}
