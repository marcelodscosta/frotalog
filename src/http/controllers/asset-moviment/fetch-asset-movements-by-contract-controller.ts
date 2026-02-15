import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchAssetMovementsByContract } from '../../../services/factories/make-fetch-asset-movements-by-contract'

export async function fetchAssetMovementsByContract(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    contractId: z.string(),
  })

  const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { contractId } = fetchParamsSchema.parse(request.params)
  const { page } = fetchQuerySchema.parse(request.query)

  const fetchAssetMovementsByContractUseCase = makeFetchAssetMovementsByContract()

  const { assetMovements } = await fetchAssetMovementsByContractUseCase.execute({
    contractId,
    page,
  })

  return reply.status(200).send(assetMovements)
}
