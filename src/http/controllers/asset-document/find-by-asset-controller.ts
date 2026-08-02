import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function findByAssetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    assetId: z.string().uuid(),
  })

  const { assetId } = paramsSchema.parse(request.params)

  const documents = await prisma.assetDocument.findMany({
    where: { assetId },
    orderBy: {
      created_at: 'desc',
    },
  })

  return reply.status(200).send({ documents })
}
