import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding maintenance data...')

  // 1. Find an active contract
  const contract = await prisma.contract.findFirst({
    where: { status: 'ACTIVE' },
    include: { movements: { where: { is_active: true } } }
  })

  if (!contract) {
    console.error('❌ No active contract found. Please create one first.')
    return
  }
  console.log(`✅ Found active contract: ${contract.contract_number} (${contract.id})`)

  // 2. Find an active asset movement for this contract
  const movement = contract.movements[0]
  if (!movement) {
    console.error('❌ No active asset movement found for this contract.')
    return
  }
  console.log(`✅ Found asset movement for asset: ${movement.assetId}`)

  // 3. Find or create a Service Category
  let serviceCategory = await prisma.serviceCategory.findFirst()
  if (!serviceCategory) {
    serviceCategory = await prisma.serviceCategory.create({
      data: {
        name: 'Manutenção Geral',
        description: 'Categoria padrão para testes',
      }
    })
    console.log('✅ Created default Service Category')
  }

  // 4. Find or create a Supplier
  let supplier = await prisma.supplier.findFirst()
  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        trading_name: 'Oficina Teste Ltda',
        company_name: 'Oficina Teste Ltda',
        cnpj: '00000000000191',
        phone: '11999999999',
        email: 'contato@oficinateste.com.br',
        contact: 'João Silva',
      }
    })
    console.log('✅ Created default Supplier')
  }

  // 5. Create Maintenance Records
  const maintenances = [
    {
      description: 'Troca de óleo e filtros',
      type: 'PREVENTIVE',
      status: 'COMPLETED',
      scheduled_date: new Date(),
      started_date: new Date(),
      completed_date: new Date(),
      actual_cost: 450.00,
      estimated_cost: 500.00,
    },
    {
      description: 'Reparo no sistema hidráulico',
      type: 'CORRECTIVE',
      status: 'COMPLETED',
      scheduled_date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
      started_date: new Date(new Date().setDate(new Date().getDate() - 2)),
      completed_date: new Date(new Date().setDate(new Date().getDate() - 1)),
      actual_cost: 1200.50,
      estimated_cost: 1000.00,
    },
    {
      description: 'Substituição de pneu estourado',
      type: 'EMERGENCY',
      status: 'IN_PROGRESS',
      scheduled_date: new Date(),
      started_date: new Date(),
      actual_cost: 800.00,
      estimated_cost: 800.00,
    }
  ]

  for (const m of maintenances) {
    await prisma.maintenance.create({
      data: {
        ...m,
        type: m.type as any,
        status: m.status as any,
        assetId: movement.assetId,
        contractId: contract.id,
        serviceCategoryId: serviceCategory.id,
        supplierId: supplier.id,
      }
    })
  }

  console.log(`✅ Successfully created ${maintenances.length} maintenance records for Asset ${movement.assetId} in Contract ${contract.contract_number}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
