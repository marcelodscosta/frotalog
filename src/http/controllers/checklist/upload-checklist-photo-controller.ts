import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

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

  const uploadsDir = path.join(process.cwd(), 'uploads', 'checklists')
  await fs.mkdir(uploadsDir, { recursive: true })

  const fileExtension = path.extname(data.filename)
  const uniqueFilename = `${randomUUID()}${fileExtension}`
  const filePath = path.join(uploadsDir, uniqueFilename)

  const buffer = await data.toBuffer()
  await fs.writeFile(filePath, buffer)

  const photoUrl = `/uploads/checklists/${uniqueFilename}`
  return reply.status(201).send({ photoUrl })
}
