import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetAssetByModel } from '../../../services/factories/make-get-asset-by-model'
import { z } from 'zod'

const getAssetByModelSchema = z.object({
  model: z.string().min(3),
  page: z.coerce.number().default(1),
})

export async function getAssetByModel(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const { model, page } = getAssetByModelSchema.parse(request.query)

  const getAssetByBrandUseCase = makeGetAssetByModel()

  const assets = await getAssetByBrandUseCase.execute({ model, page })

  return replay.status(200).send({ assets })
}
