import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ReceiveInvoiceUseCase } from '../../../services/invoice/receive-invoice-use-case'
import { PrismaInvoiceRepository } from '../../../repositories/prisma/prisma-invoice-repository'

export async function receiveInvoiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const receiveInvoiceParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const receiveInvoiceBodySchema = z.object({
    bankAccountId: z.string().uuid(),
    chartOfAccountId: z.string().uuid().optional(),
    payment_date: z.coerce.date(),
  })

  const { id } = receiveInvoiceParamsSchema.parse(request.params)
  const { bankAccountId, chartOfAccountId, payment_date } =
    receiveInvoiceBodySchema.parse(request.body)

  const invoiceRepository = new PrismaInvoiceRepository()
  const receiveInvoiceUseCase = new ReceiveInvoiceUseCase(invoiceRepository)

  const { invoice } = await receiveInvoiceUseCase.execute({
    invoiceId: id,
    bankAccountId,
    chartOfAccountId,
    payment_date,
  })

  return reply.status(200).send({ invoice })
}
