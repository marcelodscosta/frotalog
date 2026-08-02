import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function deleteAssetDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const document = await prisma.assetDocument.findUnique({
    where: { id },
  })

  if (!document) {
    return reply.status(404).send({ message: 'Document not found.' })
  }

  await prisma.assetDocument.delete({
    where: { id },
  })

  return reply.status(204).send()
}
