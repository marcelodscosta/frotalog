import { prisma } from '../src/lib/prisma'

async function main() {
  const checklistId = 'd4a6f041-8985-4cd9-a2c4-53905ebf639b'
  console.log(`Fetching Checklist ${checklistId}...`)
  
  const checklist = await prisma.checklist.findUnique({
    where: { id: checklistId },
    include: { answers: true }
  })

  if (!checklist) {
    console.log("Checklist not found.")
    return
  }

  console.log(`meterPhotoUrl: ${checklist.meterPhotoUrl}`)
  checklist.answers.forEach(a => {
    if (a.photoUrl) {
      console.log(` Answer ${a.id}: photoUrl = ${a.photoUrl}`)
    }
  })
}

main().finally(() => prisma.$disconnect())
