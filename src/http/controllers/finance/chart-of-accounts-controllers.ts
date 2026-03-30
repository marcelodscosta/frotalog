import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

// ─── Create ─────────────────────────────────────────────────────────────────────
export async function createChartOfAccountController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['REVENUE', 'EXPENSE']),
    parent_id: z.string().uuid().nullable().optional(),
  })

  const data = schema.parse(request.body)

  const existing = await prisma.chartOfAccount.findUnique({ where: { code: data.code } })
  if (existing) {
    return reply.status(409).send({ message: 'Código já cadastrado' })
  }

  const account = await prisma.chartOfAccount.create({
    data: {
      code: data.code,
      name: data.name,
      type: data.type,
      parent_id: data.parent_id || null,
    },
    include: { parent: true, children: true },
  })

  return reply.status(201).send({ account })
}

// ─── List ───────────────────────────────────────────────────────────────────────
export async function listChartOfAccountsController(_request: FastifyRequest, reply: FastifyReply) {
  const accounts = await prisma.chartOfAccount.findMany({
    where: { is_active: true },
    include: { parent: { select: { code: true, name: true } } },
    orderBy: { code: 'asc' },
  })
  return reply.send({ accounts })
}

// ─── Update ─────────────────────────────────────────────────────────────────────
export async function updateChartOfAccountController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    code: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    type: z.enum(['REVENUE', 'EXPENSE']).optional(),
    parent_id: z.string().uuid().nullable().optional(),
    is_active: z.boolean().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const account = await prisma.chartOfAccount.update({
    where: { id },
    data: {
      ...(data.code !== undefined && { code: data.code }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.parent_id !== undefined && { parent_id: data.parent_id }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
    },
    include: { parent: true, children: true },
  })

  return reply.send({ account })
}

// ─── Delete (soft) ──────────────────────────────────────────────────────────────
export async function deleteChartOfAccountController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  await prisma.chartOfAccount.update({
    where: { id },
    data: { is_active: false },
  })

  return reply.status(204).send()
}
