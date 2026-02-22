import { prisma } from './src/lib/prisma'

async function main() {
  const asset = await prisma.asset.findFirst({
    where: { plate: 'RZW0A55' },
    include: {
      Movements: true
    }
  })
  console.log(JSON.stringify(asset, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
