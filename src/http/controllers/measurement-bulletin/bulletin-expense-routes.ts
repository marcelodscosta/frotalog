import { FastifyInstance } from 'fastify'
import { requireAuth } from '../../middleware/auth'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function bulletinExpenseRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth())

  // Add expense to bulletin
  app.post('/measurement-bulletins/:bulletinId/expenses', async (request, reply) => {
    const paramsSchema = z.object({
      bulletinId: z.string().uuid(),
    })
    const bodySchema = z.object({
      description: z.string().min(1),
      unit_value: z.number().min(0),
      total_value: z.number().min(0),
    })

    const { bulletinId } = paramsSchema.parse(request.params)
    const data = bodySchema.parse(request.body)

    // Check bulletin exists and is not invoiced
    const bulletin = await prisma.measurementBulletin.findUnique({
      where: { id: bulletinId },
    })
    if (!bulletin) {
      return reply.status(404).send({ message: 'Boletim não encontrado.' })
    }
    if (bulletin.status === 'INVOICED') {
      return reply.status(400).send({ message: 'Boletim faturado não pode ser alterado.' })
    }

    // Create expense and update bulletin total_value
    const [expense] = await prisma.$transaction([
      prisma.bulletinExpense.create({
        data: {
          measurementBulletinId: bulletinId,
          description: data.description,
          unit_value: data.unit_value,
          total_value: data.total_value,
        },
      }),
      prisma.measurementBulletin.update({
        where: { id: bulletinId },
        data: {
          total_value: { increment: data.total_value },
        },
      }),
    ])

    return reply.status(201).send({ expense })
  })

  // List expenses for a bulletin
  app.get('/measurement-bulletins/:bulletinId/expenses', async (request, reply) => {
    const paramsSchema = z.object({
      bulletinId: z.string().uuid(),
    })

    const { bulletinId } = paramsSchema.parse(request.params)

    const expenses = await prisma.bulletinExpense.findMany({
      where: { measurementBulletinId: bulletinId },
      orderBy: { created_at: 'asc' },
    })

    return reply.status(200).send({ expenses })
  })

  // Delete expense
  app.delete('/measurement-bulletins/:bulletinId/expenses/:expenseId', async (request, reply) => {
    const paramsSchema = z.object({
      bulletinId: z.string().uuid(),
      expenseId: z.string().uuid(),
    })

    const { bulletinId, expenseId } = paramsSchema.parse(request.params)

    // Check bulletin is not invoiced
    const bulletin = await prisma.measurementBulletin.findUnique({
      where: { id: bulletinId },
    })
    if (!bulletin) {
      return reply.status(404).send({ message: 'Boletim não encontrado.' })
    }
    if (bulletin.status === 'INVOICED') {
      return reply.status(400).send({ message: 'Boletim faturado não pode ser alterado.' })
    }

    const expense = await prisma.bulletinExpense.findUnique({
      where: { id: expenseId },
    })

    if (!expense) {
      return reply.status(404).send({ message: 'Despesa não encontrada.' })
    }

    // Delete expense and update bulletin total_value
    await prisma.$transaction([
      prisma.bulletinExpense.delete({
        where: { id: expenseId },
      }),
      prisma.measurementBulletin.update({
        where: { id: bulletinId },
        data: {
          total_value: { decrement: expense.total_value },
        },
      }),
    ])

    return reply.status(204).send()
  })
}
