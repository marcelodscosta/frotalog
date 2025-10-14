import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetAssetByPlate } from '../../../services/factories/make-get-asset-by-plate'

const getAssetByIdSchema = z.object({
  plate: z.string(),
})

export async function getAssetByPlate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getAssetByPlateUseCase = makeGetAssetByPlate()
  const { plate } = getAssetByIdSchema.parse(request.query)

  const { asset } = await getAssetByPlateUseCase.execute({ plate })

  return reply.status(200).send({ asset })
}
