import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAssetsByPlate } from '../../../services/factories/make-find-assets-by-plate'

const getAssetByPlateSchema = z.object({
  plate: z.string(),
  page: z.coerce.number().min(1).default(1),
})

export async function getAssetByPlate(
  request: FastifyRequest<{ Params: { plate: string }, Querystring: { page?: number } }>,
  reply: FastifyReply,
) {
  const plate = request.params.plate
  const page = request.query.page || 1
  const findAssetsByPlateUseCase = makeFindAssetsByPlate()
  const result = await findAssetsByPlateUseCase.execute({ plate, page })

  return reply.status(200).send(result)
}
