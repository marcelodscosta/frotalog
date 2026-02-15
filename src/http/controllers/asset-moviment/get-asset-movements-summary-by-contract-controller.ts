import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetAssetMovementsSummaryByContract } from '../../../services/factories/make-get-asset-movements-summary-by-contract'

export async function getAssetMovementsSummaryByContract(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchParamsSchema = z.object({
    contractId: z.string(),
  })

  const { contractId } = fetchParamsSchema.parse(request.params)

  const getAssetMovementsSummaryByContractUseCase =
    makeGetAssetMovementsSummaryByContract()

  const { assetMovements } =
    await getAssetMovementsSummaryByContractUseCase.execute({
      contractId,
    })

  return reply.status(200).send({ assetMovements })
}
