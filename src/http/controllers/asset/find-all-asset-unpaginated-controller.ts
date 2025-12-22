import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllAssetUnpaginated } from '../../../services/factories/make-find-all-asset-unpaginated'

export async function findAllAssetsUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findAllAsseUnpaginatedtUseCase = makeFindAllAssetUnpaginated()

  const { assets } = await findAllAsseUnpaginatedtUseCase.execute()
  return reply.status(200).send(assets)
}
