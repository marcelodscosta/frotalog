import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterUser } from '../../../services/factories/make-register-user'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
  })

  const { name, email, password, phone, role } = registerBodySchema.parse(
    request.body,
  )

  const registerUser = makeRegisterUser()
  const { user } = await registerUser.execute({
    name,
    email,
    password,
    phone,
    role,
  })

  return reply.status(201).send({ user })
}
