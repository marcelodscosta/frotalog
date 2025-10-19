import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchUserByName } from '../../../services/factories/make-search-user-by-name'

export async function searchUserByName(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    name: z.string().min(1),
    page: z.coerce.number().min(1).default(1),
  })

  const { name, page } = querySchema.parse(request.query)

  const searchUserByName = makeSearchUserByName()
  const { users } = await searchUserByName.execute({ name, page })

  return reply.send({ users })
}
