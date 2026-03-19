import { prisma } from '../src/lib/prisma'

async function main() {
  const checklistId = 'e52d6782-f074-432d-a4f4-e84e05de05a1'
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
