import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllAssetCategories } from '../../../services/factories/make-find-all-asset-category'
import { z } from 'zod'

const findAllAssetCategoriesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

export async function findAllAllAssetCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page } = findAllAssetCategoriesSchema.parse(request.query)

  const findAllAsseCategoriestUseCase = makeFindAllAssetCategories()

  const result = await findAllAsseCategoriestUseCase.execute({
    page,
  })

  return reply.status(200).send(result)
}
