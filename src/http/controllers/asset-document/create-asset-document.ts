import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function createAssetDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    assetId: z.string().uuid(),
  })

  const bodySchema = z.object({
    document_type: z.string().min(1),
    name: z.string().min(1),
    file_path: z.string().url().nullable().optional(),
    filename: z.string().nullable().optional(),
    mime_type: z.string().nullable().optional(),
    file_size: z.number().int().nullable().optional(),
    issue_date: z.string().or(z.date()).transform((val) => new Date(val)),
    due_date: z.string().or(z.date()).nullable().optional().transform((val) => (val ? new Date(val) : null)),
    no_expiration: z.boolean().default(false),
    notes: z.string().nullable().optional(),
  })

  const { assetId } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  })

  if (!asset) {
    return reply.status(404).send({ message: 'Asset not found.' })
  }

  const document = await prisma.assetDocument.create({
    data: {
      assetId,
      document_type: data.document_type,
      name: data.name,
      file_path: data.file_path,
      filename: data.filename,
      mime_type: data.mime_type,
      file_size: data.file_size,
      issue_date: data.issue_date,
      due_date: data.due_date,
      no_expiration: data.no_expiration,
      notes: data.notes,
    },
  })

  return reply.status(201).send({ document })
}
