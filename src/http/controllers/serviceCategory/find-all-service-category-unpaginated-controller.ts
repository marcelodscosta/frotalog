import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllServiceCategoryUnpaginated } from '../../../services/factories/make-find-all-service-category-unpaginated'

export async function findAllServiceCategoryUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findAllServiceCategoryUnpaginatedUseCase =
    makeFindAllServiceCategoryUnpaginated()

  const result = await findAllServiceCategoryUnpaginatedUseCase.execute()

  return reply.status(200).send(result)
}
