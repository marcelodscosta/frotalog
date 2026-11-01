import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { rejectExpiredProposals } from '../../../services/commercial-proposal/reject-expired-proposals'

export async function fetchAllProposalsUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await rejectExpiredProposals().catch((error) => {
    request.log.error(error, 'Falha ao reprovar propostas vencidas')
  })

  const proposals = await prisma.commercialProposal.findMany({
    where: { 
      is_active: true
    },
    include: {
      client: true,
      items: true,
      user: true,
      contract: {
        select: {
          id: true,
          contract_number: true,
          status: true,
          movements: {
            where: { is_active: true },
            orderBy: { mobilization_date: 'desc' },
            select: {
              id: true,
              assetId: true,
              mobilization_date: true,
              integration_date: true,
              demobilization_date: true,
              service_executed: true,
              final_value: true,
              asset: {
                select: { id: true, plate: true, model: true, brand: true },
              },
            },
          },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  return reply.status(200).send({ proposals })
}
