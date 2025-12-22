import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllUnpaginatedSupplier } from '../../../services/factories/make-find-all-supplier-unpaginated'

export async function findAllSupplierUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findAllSupplierUngaginatedUseCase = makeFindAllUnpaginatedSupplier()

  const { supplier } = await findAllSupplierUngaginatedUseCase.execute()

  return reply.status(200).send(supplier)
}
