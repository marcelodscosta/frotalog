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
    initial_balance: z.number().optional(),
    initial_balance_date: z.coerce.date().optional(),
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
    initial_balance: z.number().optional(),
    initial_balance_date: z.coerce.date().optional(),
  })
  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)
  const useCase = makeUpdateBankAccount()
  const { bankAccount } = await useCase.execute({ id, ...data })
  return reply.send({ bankAccount })
}

// ─── List Transactions ────────────────────────────────────────────────────────
export async function listTransactionsController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2020).optional(),
    bankAccountId: z.string().uuid().optional(),
    search: z.string().optional(),
  })

  const { page, month, year, bankAccountId, search } = querySchema.parse(request.query)

  const { PrismaFinancialTransactionRepository } = await import(
    '../../../repositories/prisma/prisma-financial-transaction-repository'
  )
  const repo = new PrismaFinancialTransactionRepository()
  const result = await repo.findAll(page, { bankAccountId, month, year, search })

  return reply.send({
    items: result.data,
    totalItems: result.total,
    summary: result.summary,
  })
}

export async function updateTransactionController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    description: z.string().optional(),
    amount: z.number().optional(),
    date: z.coerce.date().optional(),
    bankAccountId: z.string().uuid().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const { PrismaFinancialTransactionRepository } = await import(
    '../../../repositories/prisma/prisma-financial-transaction-repository'
  )
  const repo = new PrismaFinancialTransactionRepository()

  const transaction = await repo.findById(id)
  if (!transaction) {
    return reply.status(404).send({ message: 'Transação não encontrada' })
  }

  const updatedTransaction = await repo.update(id, data)

  return reply.send({ transaction: updatedTransaction })
}

// ─── Transfer Between Accounts ────────────────────────────────────────────────
export async function transferBetweenAccountsController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    fromBankAccountId: z.string().uuid(),
    toBankAccountId: z.string().uuid(),
    amount: z.number().positive(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
  })

  const data = schema.parse(request.body)

  if (data.fromBankAccountId === data.toBankAccountId) {
    return reply.status(400).send({ message: 'Conta de origem e destino devem ser diferentes' })
  }

  const { PrismaBankAccountRepository } = await import(
    '../../../repositories/prisma/prisma-bank-account-repository'
  )
  const { PrismaFinancialTransactionRepository } = await import(
    '../../../repositories/prisma/prisma-financial-transaction-repository'
  )

  const bankRepo = new PrismaBankAccountRepository()
  const txRepo = new PrismaFinancialTransactionRepository()

  const fromAccount = await bankRepo.findById(data.fromBankAccountId)
  const toAccount = await bankRepo.findById(data.toBankAccountId)

  if (!fromAccount || !toAccount) {
    return reply.status(404).send({ message: 'Conta bancária não encontrada' })
  }

  const transferDate = data.date ?? new Date()
  const desc = data.description || `Transferência: ${fromAccount.name} → ${toAccount.name}`

  // Debit source account
  await bankRepo.updateBalance(data.fromBankAccountId, -data.amount)

  // Credit destination account
  await bankRepo.updateBalance(data.toBankAccountId, data.amount)

  // Record expense transaction on source
  await txRepo.create({
    bankAccount: { connect: { id: data.fromBankAccountId } },
    type: 'EXPENSE',
    amount: data.amount,
    date: transferDate,
    description: desc,
  })

  // Record income transaction on destination
  await txRepo.create({
    bankAccount: { connect: { id: data.toBankAccountId } },
    type: 'INCOME',
    amount: data.amount,
    date: transferDate,
    description: desc,
  })

  return reply.status(201).send({ message: 'Transferência realizada com sucesso' })
}

