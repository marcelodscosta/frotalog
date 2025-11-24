import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAssetsBySerialNumber } from '../../../services/factories/make-find-assets-by-serial-number'

const getAssetBySerialNumberSchema = z.object({
  serialNumber: z.string(),
  page: z.coerce.number().min(1).default(1),
})

export async function getAssetBySerialNumber(
  request: FastifyRequest<{ Params: { serialNumber: string }, Querystring: { page?: number } }>,
  reply: FastifyReply,
) {
  const serialNumber = request.params.serialNumber
  const page = request.query.page || 1
  const findAssetsBySerialNumberUseCase = makeFindAssetsBySerialNumber()
  const result = await findAssetsBySerialNumberUseCase.execute({ serialNumber, page })

  return reply.status(200).send(result)
}
