import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GeminiService } from '../../../services/ai/gemini-service'

export async function analyzePricing(request: FastifyRequest, reply: FastifyReply) {
  const analyzePricingBodySchema = z.object({
    categoryName: z.string(),
    assetValue: z.number().nonnegative(),
    durationMonths: z.number().nonnegative(),
    usefulLifeMonths: z.number().nonnegative(),
    residualValuePerc: z.number().nonnegative(),
    interestRate: z.number().nonnegative(),
    financingInstallment: z.number().nonnegative().optional(),
    maintenancePerc: z.number().nonnegative(),
    insurancePerc: z.number().nonnegative(),
    ipvaPerc: z.number().nonnegative(),
    taxesPerc: z.number().nonnegative(),
    adminPerc: z.number().nonnegative(),
    marginPerc: z.number().nonnegative(),
    suggestedMonthlyPrice: z.number().nonnegative(),
    totalRevenue: z.number().nonnegative(),
    totalCost: z.number().nonnegative(),
    netProfit: z.number(),
    depreciationMonthly: z.number().nonnegative().optional(),
  })

  const data = analyzePricingBodySchema.parse(request.body)

  const geminiService = new GeminiService()
  
  const response = await geminiService.analyzePricing(data)

  return reply.status(200).send({ report: response })
}
