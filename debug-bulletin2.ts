import { PrismaClient, MaintenanceStatus } from './src/generated/prisma'

const prisma = new PrismaClient()

async function debug() {
  const assetPlate = "NNY9D89"
  const startDate = new Date("2026-02-01T00:00:00Z")
  const endDate = new Date("2026-02-28T23:59:59Z")
  
  const maintenances = await prisma.maintenance.findMany({
    where: {
      asset: { plate: assetPlate },
      equipment_inactive: true,
      is_Active: true,
      status: {
        in: [MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.COMPLETED]
      },
      OR: [
        { started_date: { gte: startDate, lte: endDate } },
        { completed_date: { gte: startDate, lte: endDate } },
        {
          AND: [
            { started_date: { lte: startDate } },
            { OR: [{ completed_date: { gte: endDate } }, { completed_date: null }] },
          ],
        },
        {
          AND: [
             { started_date: null },
             { scheduled_date: { gte: startDate, lte: endDate } },
          ],
        },
      ],
    },
    include: { asset: true }
  })
  
  console.log(`Maintenances for ${assetPlate} between ${startDate.toISOString()} and ${endDate.toISOString()}: ${maintenances.length}`)
  maintenances.forEach(m => {
     console.log(`- Start: ${m.started_date?.toISOString()}, End: ${m.completed_date?.toISOString()}, Scheduled: ${m.scheduled_date?.toISOString()}, Status: ${m.status}`)
  })
  
  const inactiveDates = new Set<string>()

  maintenances.forEach((m) => {
    const mStart = m.started_date ? new Date(m.started_date) : new Date(m.scheduled_date!)
    const mEnd = m.completed_date ? new Date(m.completed_date) : (m.started_date ? new Date() : new Date(m.scheduled_date!))

    const iterDate = new Date(Math.max(mStart.getTime(), startDate.getTime()))
    const iterEnd = new Date(Math.min(mEnd.getTime(), endDate.getTime()))

    iterDate.setUTCHours(0, 0, 0, 0)
    iterEnd.setUTCHours(0, 0, 0, 0)

    while (iterDate <= iterEnd) {
      inactiveDates.add(iterDate.toISOString().split('T')[0])
      iterDate.setUTCDate(iterDate.getUTCDate() + 1)
    }
  })
  
  console.log("Calculated inactive days:", inactiveDates.size)
  console.log("Dates:", Array.from(inactiveDates).sort())
}

debug().catch(console.error).finally(() => prisma.$disconnect())
