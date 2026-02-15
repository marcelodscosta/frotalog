import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetActiveContractByAsset } from '../../../services/factories/make-get-active-contract-by-asset'

export async function getActiveContractByAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getActiveContractByAssetParamsSchema = z.object({
    assetId: z.string('Invalid asset id'),
  })

  const { assetId } = getActiveContractByAssetParamsSchema.parse(request.params)

  const getActiveContractByAssetUseCase = makeGetActiveContractByAsset()

  const { contract } = await getActiveContractByAssetUseCase.execute({
    assetId,
  })

  // Retorna o contrato ou null se o ativo estiver disponível
  return reply.status(200).send({ contract })
}
