import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GeminiService } from '../../../services/ai/gemini-service'
import { makeGetUserById } from '../../../services/factories/make-get-user-by-id'

export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
  const sendMessageBodySchema = z.object({
    prompt: z.string(),
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      parts: z.array(z.object({ text: z.string() }))
    })).optional(),
  })

  const { prompt, history } = sendMessageBodySchema.parse(request.body)

  const { id: userId } = z.object({ id: z.string() }).parse(request.user)
  const getUserById = makeGetUserById()
  const { user } = await getUserById.execute({ id: userId })
  const userName = user.name

  const geminiService = new GeminiService()
  
  const response = await geminiService.sendMessage(prompt, history, userName)

  return reply.status(200).send({ response })
}
