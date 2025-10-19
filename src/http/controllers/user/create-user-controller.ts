import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateUser } from '../../../services/factories/make-create-user'

export async function createUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().optional(),
    password_hash: z.string().min(6),
    role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
    avatar: z.string().optional(),
  })

  const { name, email, phone, password_hash, role, avatar } =
    createBodySchema.parse(request.body)

  const createUser = makeCreateUser()
  const { user } = await createUser.execute({
    name,
    email,
    phone,
    password_hash,
    role,
    avatar,
  })

  return reply.status(201).send({ user })
}
