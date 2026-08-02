import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function updateAssetDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    document_type: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    file_path: z.string().url().nullable().optional(),
    filename: z.string().nullable().optional(),
    mime_type: z.string().nullable().optional(),
    file_size: z.number().int().nullable().optional(),
    issue_date: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
    due_date: z.string().or(z.date()).nullable().optional().transform((val) => (val ? new Date(val) : null)),
    no_expiration: z.boolean().optional(),
    notes: z.string().nullable().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const document = await prisma.assetDocument.findUnique({
    where: { id },
  })

  if (!document) {
    return reply.status(404).send({ message: 'Document not found.' })
  }

  const updatedDocument = await prisma.assetDocument.update({
    where: { id },
    data,
  })

  return reply.status(200).send({ document: updatedDocument })
}
