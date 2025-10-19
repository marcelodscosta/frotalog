import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateUser } from '../../../services/factories/make-update-user'

export async function updateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
    avatar: z.string().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const updateData = bodySchema.parse(request.body)

  const updateUser = makeUpdateUser()
  const { user } = await updateUser.execute({
    id,
    ...updateData,
  })

  return reply.send({ user })
}
