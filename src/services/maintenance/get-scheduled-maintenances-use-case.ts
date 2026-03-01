import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface GetScheduledMaintenancesRequest {
  startDate?: Date
  endDate?: Date
  assignedToId?: string
}

interface MaintenanceCalendar extends Maintenance {
  category: 'delayed' | 'today' | 'future'
  daysDelayed: number
  daysUntil: number | null
  hourFormatted: string
  dateFormatted: string
}

interface GetScheduledMaintenancesResponse {
  all: MaintenanceCalendar[]
  delayed: MaintenanceCalendar[]
  today: MaintenanceCalendar[]
  future: MaintenanceCalendar[]
  inProgress: MaintenanceCalendar[]
  summary: {
    total: number
    totalDelayed: number
    totalToday: number
    totalFuture: number
    totalInProgress: number
    totalNext7Days: number
    totalNext30Days: number
  }
}

export class GetScheduledMaintenancesUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({
    startDate,
    endDate,
    assignedToId,
  }: GetScheduledMaintenancesRequest = {}): Promise<GetScheduledMaintenancesResponse> {
    const maintenances = await this.maintenanceRepository.findScheduledOnly({
      startDate,
      endDate,
      assignedToId,
    })

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    const all: MaintenanceCalendar[] = []
    const delayed: MaintenanceCalendar[] = []
    const todayList: MaintenanceCalendar[] = []
    const future: MaintenanceCalendar[] = []
    const inProgressList: MaintenanceCalendar[] = []

    for (const maintenance of maintenances) {
      const scheduledDate = new Date(maintenance.scheduled_date)
      const scheduledDay = new Date(
        scheduledDate.getFullYear(),
        scheduledDate.getMonth(),
        scheduledDate.getDate(),
      )

      const diffTime = scheduledDay.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const hourFormatted = scheduledDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })

      const dateFormatted = scheduledDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      let category: 'delayed' | 'today' | 'future'

      if (diffDays < 0) {
        category = 'delayed'
      } else if (diffDays === 0) {
        category = 'today'
      } else {
        category = 'future'
      }

      const maintenanceWithMeta: MaintenanceCalendar = {
        ...maintenance,
        category,
        daysDelayed: category === 'delayed' ? Math.abs(diffDays) : 0,
        daysUntil: category === 'future' ? diffDays : null,
        hourFormatted,
        dateFormatted,
      }

      all.push(maintenanceWithMeta)

      if (maintenance.status === 'IN_PROGRESS') {
        inProgressList.push(maintenanceWithMeta)
      } else if (category === 'delayed') {
        delayed.push(maintenanceWithMeta)
      } else if (category === 'today') {
        todayList.push(maintenanceWithMeta)
      } else {
        future.push(maintenanceWithMeta)
      }
    }

    const sortByDate = (a: MaintenanceCalendar, b: MaintenanceCalendar) =>
      new Date(a.scheduled_date).getTime() -
      new Date(b.scheduled_date).getTime()

    all.sort(sortByDate)
    todayList.sort(sortByDate)
    future.sort(sortByDate)
    delayed.sort((a, b) => b.daysDelayed - a.daysDelayed)

    const totalNext7Days = future.filter((m) => {
      const date = new Date(m.scheduled_date)
      return date < next7Days
    }).length

    const totalNext30Days = future.filter((m) => {
      const date = new Date(m.scheduled_date)
      return date < next30Days
    }).length

    return {
      all,
      delayed,
      today: todayList,
      future,
      inProgress: inProgressList,
      summary: {
        total: all.length,
        totalDelayed: delayed.length,
        totalToday: todayList.length,
        totalFuture: future.length,
        totalInProgress: inProgressList.length,
        totalNext7Days,
        totalNext30Days,
      },
    }
}
}
