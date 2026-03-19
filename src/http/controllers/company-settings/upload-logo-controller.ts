import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { uploadToB2 } from '../../../lib/storage'

export async function uploadLogo(request: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await request.file()

        if (!data) {
            return reply.status(400).send({ message: 'No file uploaded.' })
        }

        if (!data.mimetype.startsWith('image/')) {
            return reply.status(400).send({ message: 'Only images are allowed.' })
        }

        const buffer = await data.toBuffer()
        const { url } = await uploadToB2(buffer, data.filename, data.mimetype, 'logos')

        const existingSettings = await prisma.companySettings.findFirst()

        if (existingSettings) {
            await prisma.companySettings.update({
                where: { id: existingSettings.id },
                data: { logo_url: url },
            })
        } else {
            return reply.status(404).send({ message: 'Company settings not found. Please save settings first.' })
        }

        return reply.status(200).send({ logoUrl: url })
    } catch (error: any) {
        console.error('Error uploading logo:', error)
        return reply.status(500).send({ 
            message: 'Internal server error during logo upload', 
            details: error?.message || String(error) 
        })
    }
}
