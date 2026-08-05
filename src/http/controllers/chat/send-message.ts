import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GeminiService } from '../../../services/ai/gemini-service'
import { makeGetUserById } from '../../../services/factories/make-get-user-by-id'

export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
  let prompt: string = ''
  let history: any = undefined
  let fileData: { mimeType: string, base64: string } | undefined = undefined

  if (request.isMultipart()) {
    const parts = request.parts()
    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'file') {
        const buffer = await part.toBuffer()
        fileData = {
          mimeType: part.mimetype,
          base64: buffer.toString('base64')
        }
      } else if (part.type === 'field') {
        if (part.fieldname === 'prompt') {
          prompt = part.value as string
        }
        if (part.fieldname === 'history' && part.value) {
          try {
            history = JSON.parse(part.value as string)
          } catch (e) {
            // ignore JSON parse error
          }
        }
      }
    }
  } else {
    const sendMessageBodySchema = z.object({
      prompt: z.string(),
      history: z.array(z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({ text: z.string() }))
      })).optional(),
    })

    const body = sendMessageBodySchema.parse(request.body)
    prompt = body.prompt
    history = body.history
  }

  const { id: userId } = z.object({ id: z.string() }).parse(request.user)
  const getUserById = makeGetUserById()
  const { user } = await getUserById.execute({ id: userId })
  const userName = user.name

  const geminiService = new GeminiService()
  
  const response = await geminiService.sendMessage(prompt, history, userName, fileData)

  return reply.status(200).send({ response })
}
