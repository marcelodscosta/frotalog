import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'
import util from 'node:util'

const pump = util.promisify(pipeline)

export async function uploadLogo(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file()

    if (!data) {
        return reply.status(400).send({ message: 'No file uploaded.' })
    }

    if (!data.mimetype.startsWith('image/')) {
        return reply.status(400).send({ message: 'Only images are allowed.' })
    }

    const extension = path.extname(data.filename)
    const fileId = randomUUID()
    const fileName = `${fileId}${extension}`
    
    // Ensure uploads/logos exists (created in task step, but good to be safe or just use root uploads)
    // We configured static serving from 'uploads/' root in app.ts, so let's put it in uploads/logos/
    const uploadDir = path.resolve(__dirname, '../../../../uploads/logos')
    
    // Just in case
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.resolve(uploadDir, fileName)

    await pump(data.file, fs.createWriteStream(filePath))

    const logoUrl = `/uploads/logos/${fileName}`

    // Update the first company settings found (singleton pattern usually)
    // Or create if not exists
    const existingSettings = await prisma.companySettings.findFirst()

    let settings
    if (existingSettings) {
        settings = await prisma.companySettings.update({
            where: { id: existingSettings.id },
            data: { logo_url: logoUrl },
        })
    } else {
        // Create with minimal required fields if it doesn't exist? 
        // Usually settings should exist, but let's handle it.
        // Prisma schema says company_name is required. 
        // We might fail here if settings don't exist. 
        // But the user is supposed to be in the settings page.
        // Let's assume settings exist or we return error.
        return reply.status(404).send({ message: 'Company settings not found. Please save settings first.' })
    }

    return reply.status(200).send({ logoUrl })
}
