import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchAssetMovements } from '../../../services/factories/make-search-asset-movements'

export async function searchAssetMovements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    unpaginated: z.coerce.boolean().optional(),
    assetId: z.string().optional(),
    contractId: z.string().optional(),
    billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
    type: z.enum(['DEPLOYMENT', 'RETURN', 'MAINTENANCE', 'TRANSFER']).optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === 'true') return true
        if (val === 'false') return false
        return undefined
      }),
    mobilizationDateFrom: z.coerce.date().optional(),
    mobilizationDateTo: z.coerce.date().optional(),
  })

  const {
    page,
    unpaginated,
    assetId,
    contractId,
    billingCycle,
    type,
    isActive,
    mobilizationDateFrom,
    mobilizationDateTo,
  } = searchQuerySchema.parse(request.query)

  const searchAssetMovementsUseCase = makeSearchAssetMovements()

  const { assetMovements } = await searchAssetMovementsUseCase.execute({
    page,
    unpaginated,
    assetId,
    contractId,
    billingCycle,
    type,
    isActive,
    mobilizationDateFrom,
    mobilizationDateTo,
  })

  return reply.status(200).send(assetMovements)
}
