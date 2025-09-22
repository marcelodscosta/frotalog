import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { AssetNotFoundError } from '../../../services/errors/asset-not-found-error'
import { makeGetAssetBySerialNumber } from '../../../services/factories/make-get-asset-by-serial-number'

const getAssetByIdSchema = z.object({
  serialNumber: z.string(),
})

export async function getAssetBySerialNumber(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getAssetBySerialNumberUseCase = makeGetAssetBySerialNumber()
  const { serialNumber } = getAssetByIdSchema.parse(request.query)

  const { asset } = await getAssetBySerialNumberUseCase.execute({
    serialNumber,
  })

  if (!asset) {
    throw new AssetNotFoundError()
  }
  return reply.status(200).send({ asset })
}
