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
let metricsClientId: string

const supplierIds: string[] = []

function authHeaders() {
  return { authorization: `Bearer ${token}` }
}

function proposalNumber(label: string) {
  return `E2E-${label}-${suffix}`
}

async function createProposal(
  label: string,
  overrides: Record<string, unknown> = {},
  targetClientId = clientId,
) {
  const response = await app.inject({
    method: 'POST',
    url: '/proposals',
    headers: authHeaders(),
    payload: {
      proposal_number: proposalNumber(label),
      clientId: targetClientId,
      contact_name: 'Contato E2E',
      contact_phone: '11999999999',
      validity_days: 30,
      items: [
        { description: 'Locação de equipamento', unit: 'MES', quantity: 2, monthly_value: 1000 },
      ],
      ...overrides,
    },
  })

  expect(response.statusCode).toBe(201)
  return response.json().proposal as { id: string; proposal_number: string; status: string }
}

async function setProposalStatus(id: string, status: string) {
  const response = await app.inject({
    method: 'PATCH',
    url: `/proposals/${id}/status`,
    headers: authHeaders(),
    payload: { status },
  })
  return response
}

async function createContract(label: string, payload: Record<string, unknown> = {}) {
  const response = await app.inject({
    method: 'POST',
    url: '/contract',
    payload: {
      contract_number: `E2E-CT-${label}-${suffix}`,
      clientId,
      start_date: '2026-02-01',
      ...payload,
    },
  })
  return response
}

describe('Commercial Proposal E2E (banco de dados)', () => {
  beforeAll(async () => {
    await app.ready()

    const user = await prisma.user.create({
      data: {
        name: 'Usuario E2E Propostas',
        email: `e2e-propostas-${runId}@test.com`,
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
        company_name: `Cliente E2E Propostas ${suffix}`,
        cnpj: `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 14),
        email: `cliente-propostas-${runId}@test.com`,
        phone: '11999999999',
        contact: 'Contato E2E',
        isClient: true,
      },
    })
    clientId = client.id

    const metricsClient = await prisma.supplier.create({
      data: {
        company_name: `Cliente E2E Metricas ${suffix}`,
        cnpj: `${Date.now() + 7}${Math.floor(Math.random() * 1000)}`.slice(0, 14),
        email: `cliente-metricas-${runId}@test.com`,
        phone: '11888888888',
        contact: 'Contato Metricas',
        isClient: true,
      },
    })
    metricsClientId = metricsClient.id

    supplierIds.push(clientId, metricsClientId)
  })

  afterAll(async () => {
    await prisma.commercialProposal.deleteMany({ where: { clientId: { in: supplierIds } } })
    await prisma.contract.deleteMany({ where: { clientId: { in: supplierIds } } })
    await prisma.supplier.deleteMany({ where: { id: { in: supplierIds } } })
    await prisma.user.delete({ where: { id: userId } })
    await app.close()
  })

  it('cria proposta com itens persistidos no banco', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/proposals',
      headers: authHeaders(),
      payload: {
        proposal_number: proposalNumber('CREATE'),
        clientId,
        contact_name: 'Contato E2E',
        validity_days: 30,
        commission_percentage: 10,
        items: [
          { description: 'Locação A', unit: 'MES', quantity: 2, monthly_value: 1500 },
          { description: 'Locação B', unit: 'UN', quantity: 1, monthly_value: 500 },
        ],
      },
    })

    expect(response.statusCode).toBe(201)
    const { proposal } = response.json()

    const persisted = await prisma.commercialProposal.findUnique({
      where: { id: proposal.id },
      include: { items: true, client: true },
    })

    expect(persisted).not.toBeNull()
    expect(persisted!.status).toBe('DRAFT')
    expect(persisted!.clientId).toBe(clientId)
    expect(persisted!.client.company_name).toContain('Cliente E2E Propostas')
    expect(persisted!.userId).toBe(userId)
    expect(persisted!.items).toHaveLength(2)
    expect(Number(persisted!.commission_percentage)).toBe(10)
  })

  it('rejeita número de proposta duplicado', async () => {
    const number = proposalNumber('DUP')
    await createProposal('DUP', { proposal_number: number })

    const response = await app.inject({
      method: 'POST',
      url: '/proposals',
      headers: authHeaders(),
      payload: { proposal_number: number, clientId },
    })

    expect(response.statusCode).toBe(409)
    const count = await prisma.commercialProposal.count({ where: { proposal_number: number } })
    expect(count).toBe(1)
  })

  it('busca proposta por id com cliente e itens', async () => {
    const created = await createProposal('GET')

    const response = await app.inject({
      method: 'GET',
      url: `/proposals/${created.id}`,
      headers: authHeaders(),
    })

    expect(response.statusCode).toBe(200)
    const { proposal } = response.json()
    expect(proposal.id).toBe(created.id)
    expect(proposal.client.id).toBe(clientId)
    expect(proposal.items).toHaveLength(1)
  })

  it('atualiza proposta substituindo os itens', async () => {
    const created = await createProposal('UPDATE', {
      items: [
        { description: 'Item antigo', quantity: 1, monthly_value: 100 },
        { description: 'Item antigo 2', quantity: 1, monthly_value: 200 },
      ],
    })

    const response = await app.inject({
      method: 'PUT',
      url: `/proposals/${created.id}`,
      headers: authHeaders(),
      payload: {
        proposal_number: created.proposal_number,
        clientId,
        contact_name: 'Contato Atualizado',
        observations: 'Observação atualizada',
        items: [{ description: 'Item novo', unit: 'MES', quantity: 3, monthly_value: 750 }],
      },
    })

    expect(response.statusCode).toBe(200)

    const persisted = await prisma.commercialProposal.findUnique({
      where: { id: created.id },
      include: { items: true },
    })

    expect(persisted!.contact_name).toBe('Contato Atualizado')
    expect(persisted!.observations).toBe('Observação atualizada')
    expect(persisted!.items).toHaveLength(1)
    expect(persisted!.items[0].description).toBe('Item novo')
    expect(Number(persisted!.items[0].quantity)).toBe(3)
  })

  it('bloqueia converter status manualmente para CONVERTED', async () => {
    const created = await createProposal('STATUS-BLOCK')

    const response = await setProposalStatus(created.id, 'CONVERTED')

    expect(response.statusCode).toBe(400)
    expect(response.json().message).toContain('Gerar contrato')

    const persisted = await prisma.commercialProposal.findUnique({ where: { id: created.id } })
    expect(persisted!.status).toBe('DRAFT')
  })

  it('aprova proposta via endpoint de status', async () => {
    const created = await createProposal('APPROVE')

    const response = await setProposalStatus(created.id, 'APPROVED')

    expect(response.statusCode).toBe(200)
    const persisted = await prisma.commercialProposal.findUnique({ where: { id: created.id } })
    expect(persisted!.status).toBe('APPROVED')
  })

  it('converte proposta aprovada em contrato e mantém o vínculo', async () => {
    const created = await createProposal('CONVERT', {
      discount_value: 200,
      items: [{ description: 'Locação conversão', quantity: 2, monthly_value: 1000 }],
    })
    expect((await setProposalStatus(created.id, 'APPROVED')).statusCode).toBe(200)

    const contractNumber = `E2E-CONV-${suffix}`
    const response = await app.inject({
      method: 'POST',
      url: '/proposals/convert',
      headers: authHeaders(),
      payload: {
        proposalId: created.id,
        contract_number: contractNumber,
        start_date: '2026-03-01',
      },
    })

    expect(response.statusCode).toBe(201)
    const { contract } = response.json()
    expect(contract.contract_number).toBe(contractNumber)
    expect(contract.clientId).toBe(clientId)
    expect(contract.status).toBe('ACTIVE')
    expect(Number(contract.total_value)).toBe(1800)

    const persisted = await prisma.commercialProposal.findUnique({
      where: { id: created.id },
      include: { contract: true },
    })

    expect(persisted!.status).toBe('CONVERTED')
    expect(persisted!.contractId).toBe(contract.id)
    expect(persisted!.contract!.contract_number).toBe(contractNumber)
  })

  it('não gera um segundo contrato para a mesma proposta', async () => {
    const proposal = await prisma.commercialProposal.findFirst({
      where: { clientId, proposal_number: proposalNumber('CONVERT') },
      include: { contract: true },
    })
    expect(proposal!.contract).not.toBeNull()
    const contractsBefore = await prisma.contract.count({ where: { clientId } })

    const response = await app.inject({
      method: 'POST',
      url: '/proposals/convert',
      headers: authHeaders(),
      payload: {
        proposalId: proposal!.id,
        contract_number: `E2E-CONV-2-${suffix}`,
        start_date: '2026-03-01',
      },
    })

    expect(response.statusCode).toBe(400)
    const contractsAfter = await prisma.contract.count({ where: { clientId } })
    expect(contractsAfter).toBe(contractsBefore)

    const persisted = await prisma.commercialProposal.findUnique({ where: { id: proposal!.id } })
    expect(persisted!.contractId).toBe(proposal!.contractId)
  })

  it('vincula proposta aprovada a um contrato existente', async () => {
    const created = await createProposal('LINK')
    expect((await setProposalStatus(created.id, 'APPROVED')).statusCode).toBe(200)

    const contractResponse = await createContract('LINK')
    expect(contractResponse.statusCode).toBe(201)
    const { contract } = contractResponse.json()

    const response = await app.inject({
      method: 'PATCH',
      url: `/proposals/${created.id}/link-contract`,
      headers: authHeaders(),
      payload: { contractId: contract.id },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().proposal.status).toBe('CONVERTED')
    expect(response.json().proposal.contractId).toBe(contract.id)

    const persisted = await prisma.commercialProposal.findUnique({ where: { id: created.id } })
    expect(persisted!.status).toBe('CONVERTED')
    expect(persisted!.contractId).toBe(contract.id)
  })

  it('impede vincular um contrato já usado por outra proposta', async () => {
    const linkedContract = await prisma.commercialProposal.findFirst({
      where: { clientId, proposal_number: proposalNumber('LINK') },
      select: { contractId: true },
    })
    expect(linkedContract!.contractId).not.toBeNull()

    const other = await createProposal('LINK-CONFLICT')
    expect((await setProposalStatus(other.id, 'APPROVED')).statusCode).toBe(200)

    const response = await app.inject({
      method: 'PATCH',
      url: `/proposals/${other.id}/link-contract`,
      headers: authHeaders(),
      payload: { contractId: linkedContract!.contractId },
    })

    expect(response.statusCode).toBe(409)

    const persisted = await prisma.commercialProposal.findUnique({ where: { id: other.id } })
    expect(persisted!.contractId).toBeNull()
    expect(persisted!.status).toBe('APPROVED')
  })

  it('impede vincular contrato a proposta que já possui um', async () => {
    const linkedProposal = await prisma.commercialProposal.findFirst({
      where: { clientId, proposal_number: proposalNumber('LINK') },
      select: { id: true, contractId: true },
    })

    const response = await app.inject({
      method: 'PATCH',
      url: `/proposals/${linkedProposal!.id}/link-contract`,
      headers: authHeaders(),
      payload: { contractId: linkedProposal!.contractId },
    })

    expect(response.statusCode).toBe(400)
  })

  it('impede excluir proposta vinculada a contrato ativo', async () => {
    const linkedProposal = await prisma.commercialProposal.findFirst({
      where: { clientId, proposal_number: proposalNumber('CONVERT') },
    })

    const response = await app.inject({
      method: 'DELETE',
      url: `/proposals/${linkedProposal!.id}`,
      headers: authHeaders(),
    })

    expect(response.statusCode).toBe(400)

    const persisted = await prisma.commercialProposal.findUnique({ where: { id: linkedProposal!.id } })
    expect(persisted!.is_active).toBe(true)
  })

  it('remove logicamente proposta sem contrato', async () => {
    const created = await createProposal('DELETE')

    const response = await app.inject({
      method: 'DELETE',
      url: `/proposals/${created.id}`,
      headers: authHeaders(),
    })

    expect(response.statusCode).toBe(204)

    const persisted = await prisma.commercialProposal.findUnique({ where: { id: created.id } })
    expect(persisted!.is_active).toBe(false)

    const listResponse = await app.inject({
      method: 'GET',
      url: '/proposals/all',
      headers: authHeaders(),
    })
    expect(listResponse.statusCode).toBe(200)
    const ids = listResponse.json().proposals.map((proposal: { id: string }) => proposal.id)
    expect(ids).not.toContain(created.id)
  })

  it('lista propostas ativas com o resumo do contrato vinculado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/proposals/all',
      headers: authHeaders(),
    })

    expect(response.statusCode).toBe(200)
    const { proposals } = response.json()

    const converted = proposals.find(
      (proposal: { proposal_number: string }) => proposal.proposal_number === proposalNumber('CONVERT'),
    )

    expect(converted).toBeDefined()
    expect(converted.contract).not.toBeNull()
    expect(converted.contract.contract_number).toBe(`E2E-CONV-${suffix}`)
    expect(converted.contract.movements).toEqual([])
  })

  it('reprova propostas vencidas não aprovadas ao consultar', async () => {
    const expiredDraft = await createProposal('EXPIRED-DRAFT', { validity_days: 5 })
    const expiredSent = await createProposal('EXPIRED-SENT', { validity_days: 5 })
    const expiredApproved = await createProposal('EXPIRED-APPROVED', { validity_days: 5 })
    expect((await setProposalStatus(expiredSent.id, 'SENT')).statusCode).toBe(200)
    expect((await setProposalStatus(expiredApproved.id, 'APPROVED')).statusCode).toBe(200)

    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 30)

    await prisma.commercialProposal.updateMany({
      where: { id: { in: [expiredDraft.id, expiredSent.id, expiredApproved.id] } },
      data: { created_at: oldDate },
    })

    const response = await app.inject({
      method: 'GET',
      url: `/proposals/search?clientId=${clientId}&page=1`,
      headers: authHeaders(),
    })

    expect(response.statusCode).toBe(200)

    const statuses = await prisma.commercialProposal.findMany({
      where: { id: { in: [expiredDraft.id, expiredSent.id, expiredApproved.id] } },
      select: { id: true, status: true },
    })
    const byId = new Map(statuses.map((item) => [item.id, item.status]))

    expect(byId.get(expiredDraft.id)).toBe('REJECTED')
    expect(byId.get(expiredSent.id)).toBe('REJECTED')
    expect(byId.get(expiredApproved.id)).toBe('APPROVED')
  })

  it('calcula métricas filtradas por cliente', async () => {
    await createProposal(
      'METRICS-1',
      { items: [{ description: 'Item métricas 1', quantity: 1, monthly_value: 500 }] },
      metricsClientId,
    )
    const approved = await createProposal(
      'METRICS-2',
      { items: [{ description: 'Item métricas', quantity: 2, monthly_value: 500 }] },
      metricsClientId,
    )
    expect((await setProposalStatus(approved.id, 'APPROVED')).statusCode).toBe(200)

    const response = await app.inject({
      method: 'GET',
      url: `/proposals/metrics?clientId=${metricsClientId}`,
      headers: authHeaders(),
    })

    expect(response.statusCode).toBe(200)
    const metrics = response.json()
    expect(metrics.totalCount).toBe(2)
    expect(metrics.approvedCount).toBe(1)
    expect(metrics.totalValue).toBe(1500)
    expect(metrics.conversionRate).toBe(50)
  })
})
