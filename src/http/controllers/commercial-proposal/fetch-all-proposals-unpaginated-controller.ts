import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function fetchAllProposalsUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const proposals = await prisma.commercialProposal.findMany({
    where: { 
      is_active: true,
      status: { in: ['DRAFT', 'SENT', 'APPROVED'] }
    },
    include: {
      client: true,
      items: true,
    },
    orderBy: { created_at: 'desc' },
  })

  return reply.status(200).send({ proposals })
}
