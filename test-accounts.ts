import { prisma } from './src/lib/prisma'

async function check() {
  const accounts = await prisma.chartOfAccount.findMany()
  console.log("ChartOfAccount:", accounts)
  
  const services = await prisma.serviceCategory.findMany()
  console.log("ServiceCategory:", services)
}

check().finally(() => prisma.$disconnect())
