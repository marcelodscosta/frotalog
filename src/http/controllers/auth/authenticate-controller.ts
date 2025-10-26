import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateUser } from '../../../services/factories/make-authenticate-user'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  const authenticateUser = makeAuthenticateUser()
  const { user, token } = await authenticateUser.execute({
    email,
    password,
  })

  return reply.send({
    user,
    token,
  })
}
