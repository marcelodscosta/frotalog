import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { Maintenance } from '../../generated/prisma'

interface GetHistoryMaintenancesRequest {
  startDate?: Date
  endDate?: Date
  assignedToId?: string
}

interface MaintenanceCalendar extends Maintenance {
  category: 'delayed' | 'today' | 'future' | 'completed'
  daysDelayed: number
  daysUntil: number | null
  hourFormatted: string
  dateFormatted: string
}

interface GetHistoryMaintenancesResponse {
  history: MaintenanceCalendar[]
  summary: {
    total: number
  }
}

export class GetHistoryMaintenancesUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute({
    startDate,
    endDate,
    assignedToId,
  }: GetHistoryMaintenancesRequest = {}): Promise<GetHistoryMaintenancesResponse> {
    const now = new Date()

    let finalStartDate = startDate
    let finalEndDate = endDate

    if (!startDate && !endDate) {
      finalStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
      finalEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    } else if (startDate && !endDate) {
      finalEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59)
    }

    const maintenances = await this.maintenanceRepository.findCompletedByPeriod(
      finalStartDate!,
      finalEndDate!,
      assignedToId
    )

    const history: MaintenanceCalendar[] = maintenances.map((maintenance) => {
      const date = new Date(maintenance.completed_date || maintenance.scheduled_date)
      
      const hourFormatted = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })

      const dateFormatted = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      return {
        ...maintenance,
        category: 'completed',
        daysDelayed: 0,
        daysUntil: null,
        hourFormatted,
        dateFormatted,
      } as MaintenanceCalendar
    })

    return {
      history,
      summary: {
        total: history.length,
      },
    }
  }
}
