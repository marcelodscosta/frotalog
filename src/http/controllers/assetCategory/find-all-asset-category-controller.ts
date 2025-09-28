import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllAssetCategories } from '../../../services/factories/make-find-all-asset-category'
import { z } from 'zod'

const findAllAssetCategoriesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

type QueryParams = z.infer<typeof findAllAssetCategoriesSchema>

export async function findAllAllAssetCategories(
  request: FastifyRequest<{ Querystring: QueryParams }>,
  reply: FastifyReply,
) {
  const { page } = findAllAssetCategoriesSchema.parse(request.query)

  const findAllAsseCategoriestUseCase = makeFindAllAssetCategories()

  const { assetCategories } = await findAllAsseCategoriestUseCase.execute({
    page,
  })

  return reply.status(200).send({ assetCategories })
}
