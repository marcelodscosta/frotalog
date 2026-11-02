import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { makeCreateInvoice } from '../../../services/factories/make-create-invoice'
import { AppError } from '../../../services/errors/app-error'

export async function createContractMonthInvoice(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    contractId: z.string().uuid(),
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2020),
    due_date: z.coerce.date(),
    issue_date: z.coerce.date().optional(),
    notes: z.string().optional(),
  })

  const { contractId, month, year, due_date, issue_date, notes } =
    bodySchema.parse(request.body)

  const referenceMonth = new Date(Date.UTC(year, month - 1, 1))
  const nextMonth = new Date(Date.UTC(year, month, 1))

  const bulletins = await prisma.measurementBulletin.findMany({
    where: {
      contractId,
      is_active: true,
      status: 'APPROVED',
      reference_start: { gte: referenceMonth, lt: nextMonth },
    },
    select: { id: true },
  })

  if (bulletins.length === 0) {
    throw new AppError(
      'Não há boletins aprovados para este contrato no mês informado.',
      400,
    )
  }

  const useCase = makeCreateInvoice()
  const { invoice } = await useCase.execute({
    measurementBulletinIds: bulletins.map((bulletin) => bulletin.id),
    issue_date: issue_date ?? new Date(),
    due_date,
    notes,
  })

  return reply.status(201).send({ invoice })
}
