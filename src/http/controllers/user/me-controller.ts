import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserById } from '../../../services/factories/make-get-user-by-id'

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const { id } = paramsSchema.parse(request.user)

  const getUserById = makeGetUserById()
  const { user } = await getUserById.execute({ id })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { phone, password_hash, created_at, updated_at, ...safeUser } = user

  return reply.send({ user: safeUser })
}
