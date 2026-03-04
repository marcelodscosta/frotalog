import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

async function debug() {
  const assetId = "ed0ba2d6-44ec-40f4-8a71-88ecebace4e1" // ID from the UI or similar
  // Let's just find the maintenances for the period 01/02/2026 to 28/02/2026
  
  const maintenances = await prisma.maintenance.findMany({
    where: {
      equipment_inactive: true,
      is_Active: true,
      OR: [
        { started_date: { gte: new Date("2026-02-01"), lte: new Date("2026-02-28") } },
        { completed_date: { gte: new Date("2026-02-01"), lte: new Date("2026-02-28") } },
        {
          AND: [
            { started_date: { lte: new Date("2026-02-01") } },
            { OR: [{ completed_date: { gte: new Date("2026-02-28") } }, { completed_date: null }] },
          ],
        },
        {
          AND: [
            { started_date: null },
            { scheduled_date: { gte: new Date("2026-02-01"), lte: new Date("2026-02-28") } },
          ],
        },
      ],
    },
    include: { asset: true }
  })
  
  console.log("Maintenances found:", maintenances.length)
  maintenances.forEach(m => {
     console.log(`- Asset: ${m.asset.plate}, Start: ${m.started_date}, End: ${m.completed_date}, Scheduled: ${m.scheduled_date}`)
  })
}

debug().catch(console.error).finally(() => prisma.$disconnect())
