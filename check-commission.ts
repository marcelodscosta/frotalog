import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const contract = await prisma.contract.findFirst({
    where: { contract_number: '2026.024' },
    include: { measurementBulletins: true }
  })

  if (!contract) {
    console.log('Contract not found')
    return
  }

  console.log('Contract:', {
    id: contract.id,
    sellerId: contract.sellerId,
    commission_percentage: contract.commission_percentage,
    start_date: contract.start_date,
    commission_start_date: contract.commission_start_date,
    commission_end_date: contract.commission_end_date,
  })

  const bulletins = await prisma.measurementBulletin.findMany({
    where: { contractId: contract.id },
    orderBy: { created_at: 'desc' },
    take: 1
  })

  console.log('Last bulletin:', bulletins[0])
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
