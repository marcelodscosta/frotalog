import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchChecklistParameters } from '../../../services/factories/make-fetch-checklist-parameters'

export async function fetchChecklistParametersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeFetchChecklistParameters()
  const { parameters } = await useCase.execute()
  return reply.status(200).send({ parameters })
}
