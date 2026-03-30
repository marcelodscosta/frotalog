import { prisma } from '../src/lib/prisma'

const chartOfAccounts = [
  // 1. RECEITAS
  { code: '1', name: 'Receitas (Entradas)', type: 'REVENUE', isSynthetic: true },
  { code: '1.1', name: 'Receitas Operacionais', type: 'REVENUE', isSynthetic: true, parentCode: '1' },
  { code: '1.1.1', name: 'Locação de Máquinas e Equipamentos', type: 'REVENUE', parentCode: '1.1' },
  { code: '1.1.2', name: 'Prestação de Serviços (Mão de Obra)', type: 'REVENUE', parentCode: '1.1' },
  { code: '1.1.3', name: 'Fretes e Mobilização/Desmobilização', type: 'REVENUE', parentCode: '1.1' },
  
  { code: '1.2', name: 'Receitas Não Operacionais', type: 'REVENUE', isSynthetic: true, parentCode: '1' },
  { code: '1.2.1', name: 'Venda de Ativos / Equipamentos Usados', type: 'REVENUE', parentCode: '1.2' },
  { code: '1.2.2', name: 'Receitas Financeiras (Juros, Rendimentos)', type: 'REVENUE', parentCode: '1.2' },

  // 2. DESPESAS
  { code: '2', name: 'Despesas (Saídas)', type: 'EXPENSE', isSynthetic: true },
  
  { code: '2.1', name: 'Custos Operacionais Diretos (Frota e Máquinas)', type: 'EXPENSE', isSynthetic: true, parentCode: '2' },
  { code: '2.1.1', name: 'Peças e Acessórios para Equipamentos', type: 'EXPENSE', parentCode: '2.1' },
  { code: '2.1.2', name: 'Manutenção Terceirizada (Oficinas, Torneiros)', type: 'EXPENSE', parentCode: '2.1' },
  { code: '2.1.3', name: 'Combustíveis e Lubrificantes', type: 'EXPENSE', parentCode: '2.1' },
  { code: '2.1.4', name: 'Pneus e Borracharia', type: 'EXPENSE', parentCode: '2.1' },
  { code: '2.1.5', name: 'Fretes e Transportes (Terceiros)', type: 'EXPENSE', parentCode: '2.1' },
  { code: '2.1.6', name: 'Locação de Equipamentos de Terceiros (Sublocação)', type: 'EXPENSE', parentCode: '2.1' },

  { code: '2.2', name: 'Despesas com Pessoal (Mão de Obra Consolidada)', type: 'EXPENSE', isSynthetic: true, parentCode: '2' },
  { code: '2.2.1', name: 'Salários e Ordenados', type: 'EXPENSE', parentCode: '2.2' },
  { code: '2.2.2', name: 'Encargos Sociais (INSS, FGTS, etc)', type: 'EXPENSE', parentCode: '2.2' },
  { code: '2.2.3', name: 'Benefícios (VT, VR, Plano de Saúde)', type: 'EXPENSE', parentCode: '2.2' },
  { code: '2.2.4', name: 'EPIs e Uniformes', type: 'EXPENSE', parentCode: '2.2' },
  { code: '2.2.5', name: 'Treinamentos e Exames Ocupacionais (ASO)', type: 'EXPENSE', parentCode: '2.2' },

  { code: '2.3', name: 'Despesas Administrativas', type: 'EXPENSE', isSynthetic: true, parentCode: '2' },
  { code: '2.3.1', name: 'Aluguéis e Condomínio (Base/Galpão/Escritório)', type: 'EXPENSE', parentCode: '2.3' },
  { code: '2.3.2', name: 'Energia, Água e Internet', type: 'EXPENSE', parentCode: '2.3' },
  { code: '2.3.3', name: 'Material de Escritório, Limpeza e Copa', type: 'EXPENSE', parentCode: '2.3' },
  { code: '2.3.4', name: 'Honorários Contábeis e Jurídicos', type: 'EXPENSE', parentCode: '2.3' },
  { code: '2.3.5', name: 'Softwares e Sistemas de Gestão', type: 'EXPENSE', parentCode: '2.3' },
  { code: '2.3.6', name: 'Marketing e Publicidade', type: 'EXPENSE', parentCode: '2.3' },

  { code: '2.4', name: 'Impostos, Taxas e Seguros', type: 'EXPENSE', isSynthetic: true, parentCode: '2' },
  { code: '2.4.1', name: 'Impostos sobre Faturamento (Simples, ISS, PIS/COFINS)', type: 'EXPENSE', parentCode: '2.4' },
  { code: '2.4.2', name: 'Taxas de Veículos (IPVA, Licenciamento)', type: 'EXPENSE', parentCode: '2.4' },
  { code: '2.4.3', name: 'Seguros de Equipamentos, Frota e Patrimônio', type: 'EXPENSE', parentCode: '2.4' },

  { code: '2.5', name: 'Despesas Financeiras', type: 'EXPENSE', isSynthetic: true, parentCode: '2' },
  { code: '2.5.1', name: 'Tarifas Bancárias', type: 'EXPENSE', parentCode: '2.5' },
  { code: '2.5.2', name: 'Juros, Multas e Mora', type: 'EXPENSE', parentCode: '2.5' },
  { code: '2.5.3', name: 'Pagamento de Financiamentos/Leasing (Parcelas)', type: 'EXPENSE', parentCode: '2.5' }
]

async function seedChartOfAccounts() {
  console.log('🌱 Iniciando carga do Plano de Contas...')

  for (const acc of chartOfAccounts) {
    let parentId = null
    
    // Se a conta tem um parentCode, primeiro procuramos esse pai no BD para pegar o ID dele
    if (acc.parentCode) {
      const parent = await prisma.chartOfAccount.findUnique({
        where: { code: acc.parentCode }
      })
      if (parent) {
        parentId = parent.id
      } else {
        console.warn(`⚠️ Conta pai ${acc.parentCode} não encontrada para a conta ${acc.code}. Ignorando parent_id.`)
      }
    }

    // Faz o upsert: atualiza se já existe (baseado no código), cria se não existe.
    // Assim não quebra se o usuário já tiver criado a "1" ou "2".
    await prisma.chartOfAccount.upsert({
      where: { code: acc.code },
      update: {
        name: acc.name,
        type: acc.type as any, // 'REVENUE' | 'EXPENSE'
        parent_id: parentId
      },
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type as any,
        parent_id: parentId
      }
    })
    
    console.log(`✅ Conta ${acc.code} - ${acc.name} gerada/atualizada.`)
  }

  console.log('🎉 Plano de contas padrão carregado com sucesso!')
}

seedChartOfAccounts()
  .catch((e) => {
    console.error('Erro ao popular plano de contas:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
