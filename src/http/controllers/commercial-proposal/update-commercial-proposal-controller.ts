import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCommercialProposal } from '../../../services/factories/make-update-commercial-proposal'

export async function updateCommercialProposal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateItemSchema = z.object({
    assetId: z.string().optional().nullable(),
    assetCategoryId: z.string().optional().nullable(),
    description: z.string().optional(),
    unit: z.string().optional(),
    quantity: z.number().positive(),
    monthly_value: z.number().nonnegative(),
    franchise_hours: z.number().nonnegative().optional(),
  })

  const updateBodySchema = z.object({
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
    validity_days: z.number().int().optional(),
    body_html: z.string().optional(),
    status: z.string().optional(),
    items: z.array(updateItemSchema).optional(),
  })

  const { id } = z.object({ id: z.string().uuid() }).parse(request.params)
  const data = updateBodySchema.parse(request.body)
  
  const updateProposal = makeUpdateCommercialProposal()
  const { proposal } = await updateProposal.execute({ id, ...data })

  return reply.status(200).send({ proposal })
}
