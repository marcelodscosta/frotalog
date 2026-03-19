import { FastifyRequest, FastifyReply } from 'fastify'
import { uploadToB2 } from '../../../lib/storage'

export async function uploadChecklistPhotoController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file()

  if (!data) {
    return reply.status(400).send({ message: 'Nenhuma foto enviada' })
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedMimeTypes.includes(data.mimetype)) {
    return reply.status(400).send({ message: 'Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são aceitos.' })
  }

  const buffer = await data.toBuffer()
  const { url } = await uploadToB2(buffer, data.filename, data.mimetype, 'checklists')

  return reply.status(201).send({ photoUrl: url })
}
