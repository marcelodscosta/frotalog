import { prisma } from './src/lib/prisma'

async function main() {
  const badDate = new Date(0) // 1970-01-01T00:00:00.000Z
  
  const resultIntegration = await prisma.assetMovement.updateMany({
    where: { integration_date: badDate },
    data: { integration_date: null }
  })
  
  const resultDemobilization = await prisma.assetMovement.updateMany({
    where: { demobilization_date: badDate },
    data: { demobilization_date: null }
  })
  
  console.log(`Updated ${resultIntegration.count} integration dates and ${resultDemobilization.count} demobilization dates.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
