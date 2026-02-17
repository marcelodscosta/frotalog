
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateQuickMaintenance } from '../../../services/factories/make-create-quick-maintenance'
import { AssetNotFoundError } from '../../../services/errors/asset-not-found-error'

export async function createQuickMaintenance(request: FastifyRequest, reply: FastifyReply) {
    const createMaintenanceBodySchema = z.object({
        assetId: z.string().uuid(),
        description: z.string().default('Manutenção registrada via relatório'),
        date: z.coerce.date().default(() => new Date()),
        horometer: z.number().optional(),
        odometer: z.number().optional(),
    })

    const body = createMaintenanceBodySchema.parse(request.body)

    const useCase = makeCreateQuickMaintenance()

    try {
        const { maintenance } = await useCase.execute(body)
        return reply.status(201).send({ maintenance })
    } catch (err) {
        if (err instanceof AssetNotFoundError) {
            return reply.status(404).send({ message: err.message })
        }
        throw err
    }
}
