import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { uploadToB2 } from '../../../lib/storage'

const querySchema = z.object({
  folder: z.string().min(1).default('uploads'),
})

/**
 * Generic file upload endpoint.
 * Accepts a multipart file, uploads it to B2, and returns the public URL.
 * Used by the frontend and mobile app to replace direct Cloudinary uploads.
 *
 * POST /upload?folder=checklists
 */
export async function genericUploadController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file()

  if (!data) {
    return reply.status(400).send({ message: 'No file uploaded.' })
  }

  const { folder } = querySchema.parse(request.query)

  const buffer = await data.toBuffer()
  const { url, key } = await uploadToB2(buffer, data.filename, data.mimetype, folder)

  return reply.status(201).send({
    secure_url: url,
    public_id: key,
    resource_type: data.mimetype.split('/')[0],
    format: data.filename.split('.').pop() || '',
    bytes: buffer.length,
    original_filename: data.filename,
  })
}
