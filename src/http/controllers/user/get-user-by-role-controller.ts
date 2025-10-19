import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserByRole } from '../../../services/factories/make-get-user-by-role'

export async function getUserByRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    role: z.enum(['ADMIN', 'EMPLOYEE']),
    page: z.coerce.number().min(1).default(1),
  })

  const { role, page } = querySchema.parse(request.query)

  const getUserByRole = makeGetUserByRole()
  const { users } = await getUserByRole.execute({ role, page })

  return reply.send({ users })
}
