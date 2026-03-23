import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateCommercialProposal } from '../../../services/factories/make-create-commercial-proposal'

export async function createCommercialProposal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createItemSchema = z.object({
    assetId: z.string().optional(),
    assetCategoryId: z.string().optional(),
    description: z.string().optional(),
    unit: z.string().optional(),
    quantity: z.number().positive(),
    monthly_value: z.number().nonnegative(),
    franchise_hours: z.number().nonnegative().optional(),
  })

  const createBodySchema = z.object({
    proposal_number: z.string().min(3),
    clientId: z.string(),
    companySettingsId: z.string().optional(),
    contact_name: z.string().optional(),
    contact_phone: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
    mobilization_value: z.number().nonnegative().optional(),
    demobilization_value: z.number().nonnegative().optional(),
    payment_conditions: z.string().optional(),
    rental_period: z.string().optional(),
    technical_notes: z.string().optional(),
    observations: z.string().optional(),
    validity_days: z.number().int().optional(),
    body_html: z.string().optional(),
    items: z.array(createItemSchema).optional(),
  })

  const data = createBodySchema.parse(request.body)
  const createProposal = makeCreateCommercialProposal()
  const { proposal } = await createProposal.execute(data)

  return reply.status(201).send({ proposal })
}
