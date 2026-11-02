import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { makeCreateMeasurementBulletin } from '../../../services/factories/make-create-measurement-bulletin'
import { AppError } from '../../../services/errors/app-error'

export async function createBatchMeasurementBulletins(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    contractId: z.string().uuid(),
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2020),
  })

  const { contractId, month, year } = bodySchema.parse(request.body)

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    select: { id: true, is_Active: true, status: true },
  })
  if (!contract || !contract.is_Active) {
    throw new AppError('Contrato não encontrado.', 404)
  }
  if (contract.status !== 'ACTIVE' && contract.status !== 'FINISHED') {
    throw new AppError('Somente contratos ativos ou finalizados podem ser medidos.', 400)
  }

  const referenceStart = new Date(Date.UTC(year, month - 1, 1))
  const referenceEnd = new Date(Date.UTC(year, month, 0))

  const movements = await prisma.assetMovement.findMany({
    where: { contractId, is_active: true },
    select: { id: true },
  })

  if (movements.length === 0) {
    throw new AppError('O contrato não possui movimentações ativas.', 400)
  }

  const useCase = makeCreateMeasurementBulletin()
  const errors: Array<{ assetMovementId: string; message: string }> = []
  let created = 0
  let skipped = 0

  for (const movement of movements) {
    try {
      await useCase.execute({
        contractId,
        assetMovementId: movement.id,
        reference_start: referenceStart,
        reference_end: referenceEnd,
      })
      created += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      if (message.includes('Já existe um boletim')) {
        skipped += 1
      } else {
        errors.push({ assetMovementId: movement.id, message })
      }
    }
  }

  return reply.status(200).send({
    created,
    skipped,
    errors,
    processed: movements.length,
  })
}
