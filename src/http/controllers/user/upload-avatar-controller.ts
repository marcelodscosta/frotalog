import { FastifyRequest, FastifyReply } from 'fastify'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'

export async function uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ message: 'No file uploaded.' })
    }

    const { filename, file } = data

    // Allow only images
    const mimeType = data.mimetype
    if (!mimeType.startsWith('image/')) {
        return reply.status(400).send({ message: 'Invalid file type. Only images are allowed.' })
    }

    const extension = path.extname(filename)
    const uniqueFilename = `${randomUUID()}${extension}`

    // Resolve upload dir using process.cwd() to ensure it's in the project root
    const uploadDir = path.resolve(process.cwd(), 'uploads/avatars')
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.resolve(uploadDir, uniqueFilename)
    
    const writeStream = fs.createWriteStream(filePath)
    await new Promise((resolve, reject) => {
        file.pipe(writeStream)
        file.on('end', resolve)
        file.on('error', reject)
    })

    const avatarUrl = `/uploads/avatars/${uniqueFilename}`

    return reply.status(200).send({ avatarUrl })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return reply.status(500).send({ message: 'Internal server error while uploading avatar' })
  }
}
