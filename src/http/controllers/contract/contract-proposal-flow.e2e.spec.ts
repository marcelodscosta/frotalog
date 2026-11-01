import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import jwt from 'jsonwebtoken'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { env } from '../../../env'

const runId = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`
const suffix = runId.slice(-10)

let token: string
let userId: string
let clientId: string

function proposalNumber(label: string) {
  return `E2E-CONTRACT-${label}-${suffix}`
}

async function createProposal(label: string, overrides: Record<string, unknown> = {}) {
  const response = await app.inject({
    method: 'POST',
    url: '/proposals',
    headers: { authorization: `Bearer ${token}` },
    payload: {
      proposal_number: proposalNumber(label),
      clientId,
      validity_days: 30,
      contact_name: 'Contato Contrato E2E',
      contact_email: 'contato-contrato@test.com',
      commission_percentage: 12.5,
      items: [{ description: 'Locação contrato', quantity: 2, monthly_value: 1000 }],
      ...overrides,
    },
  })

  expect(response.statusCode).toBe(201)
  return response.json().proposal as { id: string; status: string }
}

async function approveProposal(id: string) {
  const response = await app.inject({
    method: 'PATCH',
    url: `/proposals/${id}/status`,
    headers: { authorization: `Bearer ${token}` },
    payload: { status: 'APPROVED' },
  })
  expect(response.statusCode).toBe(200)
}

async function createContractWithProposal(label: string, proposalId: string) {
  const contractNumber = `E2E-FLOW-${label}-${suffix}`
  const response = await app.inject({
    method: 'POST',
    url: '/contract',
    payload: {
      contract_number: contractNumber,
      clientId,
      proposalId,
      start_date: '2026-04-01',
      total_value: 2000,
    },
  })
  return { response, contractNumber }
}

describe('Contrato a partir de proposta E2E (banco de dados)', () => {
  beforeAll(async () => {
    await app.ready()

    const user = await prisma.user.create({
      data: {
        name: 'Usuario E2E Contrato',
        email: `e2e-contrato-${runId}@test.com`,
        password_hash: 'e2e',
        role: 'ADMIN',
      },
    })
    userId = user.id

    token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    const client = await prisma.supplier.create({
      data: {
        company_name: `Cliente E2E Contrato ${suffix}`,
        cnpj: `${Date.now() + 3}${Math.floor(Math.random() * 1000)}`.slice(0, 14),
        email: `cliente-contrato-${runId}@test.com`,
        phone: '11999999999',
        contact: 'Contato Contrato',
        isClient: true,
      },
    })
    clientId = client.id
  })

  afterAll(async () => {
    await prisma.commercialProposal.deleteMany({ where: { clientId } })
    await prisma.contract.deleteMany({ where: { clientId } })
    await prisma.supplier.delete({ where: { id: clientId } })
    await prisma.user.delete({ where: { id: userId } })
    await app.close()
  })

  it('cria contrato a partir de proposta aprovada e herda vendedor e comissão', async () => {
    const proposal = await createProposal('LINK')
    await approveProposal(proposal.id)

    const { response, contractNumber } = await createContractWithProposal('LINK', proposal.id)
    expect(response.statusCode).toBe(201)

    const { contract } = response.json()
    expect(contract.contract_number).toBe(contractNumber)
    expect(contract.clientId).toBe(clientId)
    expect(contract.sellerId).toBe(userId)
    expect(Number(contract.commission_percentage)).toBe(12.5)

    const persistedProposal = await prisma.commercialProposal.findUnique({
      where: { id: proposal.id },
      include: { contract: true },
    })

    expect(persistedProposal!.status).toBe('CONVERTED')
    expect(persistedProposal!.contractId).toBe(contract.id)
    expect(persistedProposal!.contract!.contract_number).toBe(contractNumber)
  })

  it('não cria contrato para proposta não aprovada', async () => {
    const proposal = await createProposal('DRAFT')
    const contractsBefore = await prisma.contract.count({ where: { clientId } })

    const { response, contractNumber } = await createContractWithProposal('DRAFT', proposal.id)

    expect(response.statusCode).toBe(400)

    const contractsAfter = await prisma.contract.count({ where: { clientId } })
    expect(contractsAfter).toBe(contractsBefore)
    expect(await prisma.contract.count({ where: { contract_number: contractNumber } })).toBe(0)

    const persistedProposal = await prisma.commercialProposal.findUnique({ where: { id: proposal.id } })
    expect(persistedProposal!.status).toBe('DRAFT')
    expect(persistedProposal!.contractId).toBeNull()
  })

  it('não cria segundo contrato para proposta já vinculada', async () => {
    const linkedProposal = await prisma.commercialProposal.findFirst({
      where: { clientId, proposal_number: proposalNumber('LINK') },
      select: { id: true, contractId: true },
    })
    const contractsBefore = await prisma.contract.count({ where: { clientId } })

    const { response, contractNumber } = await createContractWithProposal(
      'DUPLICATE',
      linkedProposal!.id,
    )

    expect(response.statusCode).toBe(400)

    const contractsAfter = await prisma.contract.count({ where: { clientId } })
    expect(contractsAfter).toBe(contractsBefore)
    expect(await prisma.contract.count({ where: { contract_number: contractNumber } })).toBe(0)

    const persistedProposal = await prisma.commercialProposal.findUnique({
      where: { id: linkedProposal!.id },
    })
    expect(persistedProposal!.contractId).toBe(linkedProposal!.contractId)
  })

  it('não cria contrato quando a proposta informada não existe', async () => {
    const contractsBefore = await prisma.contract.count({ where: { clientId } })
    const missingProposalId = '00000000-0000-4000-8000-000000000000'

    const { response, contractNumber } = await createContractWithProposal(
      'MISSING',
      missingProposalId,
    )

    expect(response.statusCode).toBe(404)

    const contractsAfter = await prisma.contract.count({ where: { clientId } })
    expect(contractsAfter).toBe(contractsBefore)
    expect(await prisma.contract.count({ where: { contract_number: contractNumber } })).toBe(0)
  })

  it('cria contrato independente sem alterar propostas existentes', async () => {
    const proposal = await createProposal('UNTOUCHED')
    const contractNumber = `E2E-FLOW-INDEPENDENT-${suffix}`

    const response = await app.inject({
      method: 'POST',
      url: '/contract',
      payload: {
        contract_number: contractNumber,
        clientId,
        start_date: '2026-05-01',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json().contract.proposalId).toBeUndefined()

    const persistedProposal = await prisma.commercialProposal.findUnique({ where: { id: proposal.id } })
    expect(persistedProposal!.status).toBe('DRAFT')
    expect(persistedProposal!.contractId).toBeNull()
  })
})
