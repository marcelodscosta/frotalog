import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../services/errors/app-error'

export async function linkProposalContract(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    contractId: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const { contractId } = bodySchema.parse(request.body)

  const proposal = await prisma.commercialProposal.findUnique({
    where: { id },
    select: { id: true, is_active: true, contractId: true, proposal_number: true },
  })

  if (!proposal || !proposal.is_active) {
    throw new AppError('Proposta não encontrada.', 404)
  }

  if (proposal.contractId) {
    throw new AppError('Esta proposta já possui um contrato vinculado.', 400)
  }

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    select: { id: true, is_Active: true, contract_number: true },
  })

  if (!contract || !contract.is_Active) {
    throw new AppError('Contrato não encontrado.', 404)
  }

  const existingLink = await prisma.commercialProposal.findFirst({
    where: { contractId, is_active: true },
    select: { id: true },
  })

  if (existingLink) {
    throw new AppError(
      `O contrato ${contract.contract_number} já está vinculado a outra proposta.`,
      409,
    )
  }

  const updated = await prisma.commercialProposal.update({
    where: { id },
    data: {
      status: 'CONVERTED',
      contract: { connect: { id: contractId } },
    },
    select: { id: true, status: true, contractId: true },
  })

  return reply.status(200).send({ proposal: updated, contract })
}
