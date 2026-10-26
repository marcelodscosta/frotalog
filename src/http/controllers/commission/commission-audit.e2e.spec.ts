import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../../../env'

/**
 * Este teste audita os dados EXISTENTES no banco de dados.
 * Ele verifica se a lógica de comissões está consistente com o que já foi cadastrado.
 */
describe('Auditoria de Comissões (Dados Existentes)', () => {
  let adminToken: string

  beforeAll(async () => {
    await app.ready()
    adminToken = jwt.sign(
      { sub: 'audit-user', email: 'admin@test.com', role: 'ADMIN' },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    )
  })

  it('deve validar que contratos com comissão configurada possuem ou geram grade', async () => {
    // Buscar contratos que deveriam ter comissão
    const contracts = await prisma.contract.findMany({
      where: {
        sellerId: { not: null },
        commission_percentage: { gt: 0 },
      },
      take: 5
    })

    if (contracts.length === 0) {
      console.log('⚠️ Nenhum contrato com comissão configurada encontrado para auditoria.')
      return
    }

    for (const contract of contracts) {
      const response = await app.inject({
        method: 'GET',
        url: `/contract/${contract.id}/commissions`,
        headers: { authorization: `Bearer ${adminToken}` },
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      
      console.log(`✅ Contrato ${contract.contract_number}: ${body.items.length} meses de comissão verificados.`)
      
      // Verifica consistência básica
      body.items.forEach((c: any) => {
        expect(c.contractId).toBe(contract.id)
        expect(c.sellerId).toBe(contract.sellerId)
        
        // Se houver valor base, o valor da comissão deve bater com o cálculo (permitindo pequena margem de erro decimal)
        if (Number(c.base_value) > 0) {
          const expected = Number(c.base_value) * (Number(c.commission_percentage) / 100)
          expect(Math.abs(Number(c.commission_value) - expected)).toBeLessThan(0.01)
        }
      })
    }
  })

  it('deve validar que comissões pagas possuem data de pagamento', async () => {
    const paidCommissions = await prisma.commission.findMany({
      where: { status: 'PAID' },
      take: 10
    })

    for (const commission of paidCommissions) {
      expect(commission.paid_at).not.toBeNull()
      console.log(`✅ Comissão ${commission.id} (Paga em ${commission.reference_month.toISOString()}): data de pagamento confirmada.`)
    }
  })
})
