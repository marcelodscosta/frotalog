import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetCompanySettings } from '../../../services/factories/make-get-company-settings'

export async function getCompanySettings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeGetCompanySettings()
  const { companySettings } = await useCase.execute()

  return reply.status(200).send({ companySettings })
}
