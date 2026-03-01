import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateInvoice } from '../../../services/factories/make-create-invoice'

export async function createInvoice(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    measurementBulletinIds: z.array(z.string().uuid()),
    invoice_number: z.string().optional(),
    issue_date: z.coerce.date(),
    due_date: z.coerce.date(),
    total_value: z.number().optional(),
    notes: z.string().optional().nullable(),
  })

  const data = bodySchema.parse(request.body)
  const useCase = makeCreateInvoice()
  const { invoice } = await useCase.execute(data)

  return reply.status(201).send({ invoice })
}
