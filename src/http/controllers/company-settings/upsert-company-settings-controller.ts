import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpsertCompanySettings } from '../../../services/factories/make-upsert-company-settings'

export async function upsertCompanySettings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    company_name: z.string().min(1),
    trading_name: z.string().optional().nullable(),
    cnpj: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    zip_code: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    logo_url: z.string().optional().nullable(),
    invoice_start_number: z.number().int().positive().optional(),
  })

  const data = bodySchema.parse(request.body)
  const useCase = makeUpsertCompanySettings()
  const { companySettings } = await useCase.execute(data)

  return reply.status(200).send({ companySettings })
}
