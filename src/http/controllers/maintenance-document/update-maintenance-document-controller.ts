import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateMaintenanceDocument } from '../../../services/factories/make-update-maintenance-document'
import { MaintenanceDocumentNotFoundError } from '../../../services/errors/maintenance-document-not-found-error'

export async function updateMaintenanceDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateBodySchema = z.object({
    original_name: z.string().optional(),
    description: z.string().optional(),
  })

  const { id } = updateParamsSchema.parse(request.params)
  const { original_name, description } = updateBodySchema.parse(request.body)

  try {
    const updateUseCase = makeUpdateMaintenanceDocument()

    const { document } = await updateUseCase.execute({
      id,
      original_name,
      description,
    })

    return reply.status(200).send({
      document,
    })
  } catch (error) {
    if (error instanceof MaintenanceDocumentNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
