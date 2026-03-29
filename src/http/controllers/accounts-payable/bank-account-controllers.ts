import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateBankAccount } from '../../../services/factories/make-create-bank-account'
import { makeListBankAccounts } from '../../../services/factories/make-list-bank-accounts'
import { makeUpdateBankAccount } from '../../../services/factories/make-update-bank-account'
import { z } from 'zod'

export async function createBankAccountController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string().min(1),
    bank_name: z.string().optional(),
    agency: z.string().optional(),
    account_number: z.string().optional(),
    balance: z.number().optional(),
  })
  const data = schema.parse(request.body)
  const useCase = makeCreateBankAccount()
  const { bankAccount } = await useCase.execute(data)
  return reply.status(201).send({ bankAccount })
}

export async function listBankAccountsController(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListBankAccounts()
  const { bankAccounts } = await useCase.execute()
  return reply.send({ bankAccounts })
}

export async function updateBankAccountController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    bank_name: z.string().optional(),
    agency: z.string().optional(),
    account_number: z.string().optional(),
  })
  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)
  const useCase = makeUpdateBankAccount()
  const { bankAccount } = await useCase.execute({ id, ...data })
  return reply.send({ bankAccount })
}
