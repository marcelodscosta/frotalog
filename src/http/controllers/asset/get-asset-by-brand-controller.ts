import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetAssetByBrand } from '../../../services/factories/make-get-asset-by-brand'
import { z } from 'zod'

const getAssetByBrandSchema = z.object({
  brand: z.string().min(3),
  page: z.coerce.number().default(1),
})

export async function getAssetByBrand(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const { brand, page } = getAssetByBrandSchema.parse(request.query)

  const getAssetByBrandUseCase = makeGetAssetByBrand()

  const result = await getAssetByBrandUseCase.execute({ brand, page })

  return replay.status(200).send(result)
}
