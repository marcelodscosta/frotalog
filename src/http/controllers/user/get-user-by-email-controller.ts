import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserByEmail } from '../../../services/factories/make-get-user-by-email'

export async function getUserByEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    email: z.string().email(),
  })

  const { email } = querySchema.parse(request.query)

  const getUserByEmail = makeGetUserByEmail()
  const { user } = await getUserByEmail.execute({ email })

  return reply.send({ user })
}
