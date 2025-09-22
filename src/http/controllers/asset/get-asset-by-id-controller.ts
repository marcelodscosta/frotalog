import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetAssetById } from '../../../services/factories/make-get-asset-by-id'
import { z } from 'zod'
import { AssetNotFoundError } from '../../../services/errors/asset-not-found-error'

const getAssetByIdSchema = z.object({
  id: z.string(),
})

export async function getAssetById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getAssetUseCase = makeGetAssetById()
  const { id } = getAssetByIdSchema.parse(request.query)

  const { asset } = await getAssetUseCase.execute({ id })

  if (!asset) {
    throw new AssetNotFoundError()
  }
  return reply.status(200).send({ asset })
}
