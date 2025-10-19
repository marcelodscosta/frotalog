import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAllUser } from '../../../services/factories/make-find-all-user'

export async function findAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = querySchema.parse(request.query)

  const findAllUsers = makeFindAllUser()
  const { users } = await findAllUsers.execute({ page })

  return reply.send({ users })
}
