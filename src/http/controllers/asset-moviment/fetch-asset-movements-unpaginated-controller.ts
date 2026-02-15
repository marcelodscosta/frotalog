import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchAssetMovementsUnpaginated } from '../../../services/factories/make-fetch-asset-movements-unpaginated'

export async function fetchAssetMovementsUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAssetMovementsUnpaginatedUseCase =
    makeFetchAssetMovementsUnpaginated()

  const { assetMovements } =
    await fetchAssetMovementsUnpaginatedUseCase.execute()

  return reply.status(200).send(assetMovements)
}
