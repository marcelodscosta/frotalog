import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllAsset } from '../../../services/factories/make-find-all-asset'
import { z } from 'zod'

const findAllAssetSchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

type QueryParams = z.infer<typeof findAllAssetSchema>

export async function findAllAssets(
  request: FastifyRequest<{ Querystring: QueryParams }>,
  reply: FastifyReply,
) {
  const { page } = findAllAssetSchema.parse(request.query)

  const findAllAssetUseCase = makeFindAllAsset()

  const assets = await findAllAssetUseCase.execute({
    page,
  })
  return reply.status(200).send(assets)
}
