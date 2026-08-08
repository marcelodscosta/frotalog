import { FastifyRequest, FastifyReply } from 'fastify'
import { makeUploadInvoiceDocument } from '../../../services/factories/make-upload-invoice-document'
import { uploadToB2 } from '../../../lib/storage'

export async function uploadInvoiceDocumentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file()

  if (!data) {
    return reply.status(400).send({ message: 'No file uploaded' })
  }

  const invoiceId = (data.fields as any)?.invoiceId?.value as string
  const documentType = (data.fields as any)?.document_type?.value as string
  const description = (data.fields as any)?.description?.value as string

  if (!invoiceId) {
    return reply.status(400).send({ message: 'invoiceId is required' })
  }

  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  if (!allowedMimeTypes.includes(data.mimetype)) {
    return reply.status(400).send({ 
      message: 'Invalid file type. Only PDF, images and documents are allowed' 
    })
  }

  const buffer = await data.toBuffer()
  const maxFileSize = 10 * 1024 * 1024
  
  if (buffer.length > maxFileSize) {
    return reply.status(400).send({ 
      message: 'File too large. Maximum size is 10MB' 
    })
  }

  const { url, key } = await uploadToB2(buffer, data.filename, data.mimetype, 'invoice-documents')

  try {
    const useCase = makeUploadInvoiceDocument()
    const { document } = await useCase.execute({
      invoiceId,
      filename: key.split('/').pop() || data.filename,
      original_name: data.filename,
      file_path: url,
      file_size: buffer.length,
      mime_type: data.mimetype,
      document_type: documentType,
      description,
    })

    return reply.status(201).send({ document })
  } catch (error: any) {
    return reply.status(400).send({ message: error.message || 'Error creating invoice document' })
  }
}
