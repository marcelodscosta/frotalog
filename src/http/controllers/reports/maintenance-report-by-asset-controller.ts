// controllers/maintenance/maintenance-report-by-asset-controller.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeMaintenanceByAssetUseCase } from '../../../services/factories/make-maintenance-by-asset-use-case'

const querySchema = z.object({
  assetId: z.string(),
  startDate: z.string().transform((val) => {
    // Adicionar T00:00:00.000Z para garantir UTC
    const date = new Date(val + 'T00:00:00.000Z')
    return date
  }),
  endDate: z.string().transform((val) => {
    // Adicionar T23:59:59.999Z para garantir UTC
    const date = new Date(val + 'T23:59:59.999Z')
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
