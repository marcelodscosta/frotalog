import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeToggleUserStatus } from '../../../services/factories/make-toggle-user-status'

export async function toggleUserStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    action: z.enum(['activate', 'deactivate']),
  })

  const { id } = paramsSchema.parse(request.params)
  const { action } = bodySchema.parse(request.body)

  const toggleUserStatus = makeToggleUserStatus()
  const { user } = await toggleUserStatus.execute({ id, action })

  return reply.send({ user })
}
