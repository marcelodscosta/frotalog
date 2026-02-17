import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetAssetReadingsUseCase } from '../../../services/operational/get-asset-readings-use-case'

export async function getAssetReadings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getAssetReadingsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = getAssetReadingsQuerySchema.parse(request.query)

  const getAssetReadingsUseCase = new GetAssetReadingsUseCase()

  const { readings } = await getAssetReadingsUseCase.execute({
    page,
  })

  return reply.status(200).send({ readings })
}
