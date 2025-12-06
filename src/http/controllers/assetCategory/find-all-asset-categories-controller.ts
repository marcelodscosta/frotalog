import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllAssetCategoriesAll } from '../../../services/factories/make-find-all-asset-categories'

export async function findAllAllAssetCategoriesAll(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findAllAsseCategoriestUseCase = makeFindAllAssetCategoriesAll()

  const result = await findAllAsseCategoriestUseCase.execute()

  return reply.status(200).send(result)
}
