import { PrismaClient } from './src/generated/prisma'
const prisma = new PrismaClient()
async function main() {
  await prisma.$executeRawUnsafe(`DELETE FROM _prisma_migrations WHERE migration_name = '20260815000000_add_commissions'`)
  console.log('Migration deleted locally')
}
main()
