import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserById } from '../../../services/factories/make-get-user-by-id'

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const getUserById = makeGetUserById()
  const { user } = await getUserById.execute({ id })

  return reply.send({ user })
}
