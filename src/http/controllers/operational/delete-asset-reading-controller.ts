import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { DeleteAssetReadingUseCase } from '../../../services/operational/delete-asset-reading-use-case'

export async function deleteAssetReading(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteAssetReadingParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteAssetReadingParamsSchema.parse(request.params)

  const deleteAssetReadingUseCase = new DeleteAssetReadingUseCase()

  await deleteAssetReadingUseCase.execute({
    readingId: id,
  })

  return reply.status(204).send()
}
