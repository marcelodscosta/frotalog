import { PrismaClient } from './src/generated/prisma'
const prisma = new PrismaClient()

async function main() {
  const supplier = await prisma.supplier.findFirst({
    where: {
      company_name: {
        contains: 'Top Locações',
        mode: 'insensitive'
      }
    }
  })
  if (supplier) {
    console.log('SUPPLIER_ID_FOUND:', supplier.id)
  } else {
    console.log('SUPPLIER_NOT_FOUND')
    const firstSupplier = await prisma.supplier.findFirst()
    if (firstSupplier) {
       console.log('First supplier found instead:', firstSupplier.id, firstSupplier.company_name)
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
