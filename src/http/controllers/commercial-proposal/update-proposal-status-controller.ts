import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function updateProposalStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateStatusParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateStatusBodySchema = z.object({
    status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CANCELLED', 'CONVERTED']),
  })

  const { id } = updateStatusParamsSchema.parse(request.params)
  const { status } = updateStatusBodySchema.parse(request.body)

  const proposal = await prisma.commercialProposal.update({
    where: { id },
    data: { status },
  })

  return reply.status(200).send({ proposal })
}
