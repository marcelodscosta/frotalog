import { FastifyRequest, FastifyReply } from 'fastify'
import { uploadToB2 } from '../../../lib/storage'

export async function uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ message: 'No file uploaded.' })
    }

    const mimeType = data.mimetype
    if (!mimeType.startsWith('image/')) {
      return reply.status(400).send({ message: 'Invalid file type. Only images are allowed.' })
    }

    const buffer = await data.toBuffer()
    const { url } = await uploadToB2(buffer, data.filename, data.mimetype, 'avatars')

    return reply.status(200).send({ avatarUrl: url })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return reply.status(500).send({ message: 'Internal server error while uploading avatar' })
  }
}
