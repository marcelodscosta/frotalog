import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../services/errors/app-error'
import { assertProposalTransition } from '../../../services/commercial-proposal/proposal-status-transitions'

export async function updateProposalStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateStatusParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateStatusBodySchema = z.object({
    status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CANCELLED', 'CONVERTED', 'EXPIRED']),
  })

  const { id } = updateStatusParamsSchema.parse(request.params)
  const { status } = updateStatusBodySchema.parse(request.body)

  if (status === 'CONVERTED') {
    throw new AppError('Use a ação "Gerar contrato" para converter uma proposta aprovada.', 400)
  }

  const current = await prisma.commercialProposal.findUnique({
    where: { id },
    select: { status: true },
  })

  if (!current) {
    throw new AppError('Proposta não encontrada.', 404)
  }

  if (current.status === 'CONVERTED') {
    throw new AppError('Uma proposta convertida não pode ter o status alterado.', 400)
  }

  assertProposalTransition(current.status, status)

  const proposal = await prisma.commercialProposal.update({
    where: { id },
    data: {
      status,
      ...(status === 'SENT' ? { sent_at: new Date() } : {}),
    },
  })

  return reply.status(200).send({ proposal })
}
