import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
  await prisma.payableExpense.updateMany({
    where: { maintenance_approved_by: 'Usuário logado' },
    data: { maintenance_approved_by: 'Marcelo' }
  })
  await prisma.payableExpense.updateMany({
    where: { finance_approved_by: 'Usuário logado' },
    data: { finance_approved_by: 'Marcelo' }
  })
  await prisma.payableExpense.updateMany({
    where: { director_approved_by: 'Usuário logado' },
    data: { director_approved_by: 'Marcelo' }
  })
  console.log('Fixed!')
}

run()
