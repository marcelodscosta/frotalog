import { FastifyReply, FastifyRequest } from 'fastify'
import { uploadToB2 } from '../../../lib/storage'

export async function uploadSignedContract(request: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await request.file()

        if (!data) {
            return reply.status(400).send({ message: 'No file uploaded.' })
        }

        // Permite PDF e Imagens para contratos assinados
        const allowedMimetypes = ['application/pdf', 'image/jpeg', 'image/png']
        if (!allowedMimetypes.includes(data.mimetype)) {
            return reply.status(400).send({ message: 'Only PDF and images (JPG, PNG) are allowed.' })
        }

        const buffer = await data.toBuffer()
        const { url } = await uploadToB2(buffer, data.filename, data.mimetype, 'contracts')

        return reply.status(200).send({ url })
    } catch (error: any) {
        console.error('Error uploading signed contract:', error)
        return reply.status(500).send({ 
            message: 'Internal server error during contract upload', 
            details: error?.message || String(error) 
        })
    }
}
