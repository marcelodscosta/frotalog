import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface MaintenanceByAssetRequest {
  assetId?: string
  startDate: Date
  endDate: Date
}

interface MaintenanceByAssetResponse {
  maintenances: Maintenance[]
  summary: {
    totalMaintenances: number
    totalDays: number
    operativeDays: number
    inoperativeDays: number
  }
  dailyStatus: Array<{
    date: string
    status: 'OPERATIVE' | 'INOPERATIVE'
    maintenanceId?: string | null
  }>
}

export class MaintenanceByAssetUseCase {
  constructor(private maintenanceRepository: IMaintenanceRepository) {}

  async execute(
    request: MaintenanceByAssetRequest,
  ): Promise<MaintenanceByAssetResponse> {
    console.log('🚀 Use Case recebeu:', {
      assetId: request.assetId,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
    })

    // Usa as datas diretamente (já ajustadas pelo controller para 03:00 UTC = 00:00 BRT)
    const startDate = request.startDate
    const endDate = request.endDate

    const maintenances =
      await this.maintenanceRepository.findMaintenancesByAssetPeriod(
        request.assetId,
        startDate,
        endDate,
      )

    const dailyStatus: MaintenanceByAssetResponse['dailyStatus'] = []
    
    // Inicia loop na data de início (ex: 03:00 UTC)
    const currentDate = new Date(startDate)

    console.log('📊 Gerando dailyStatus...')
    console.log('📋 Manutenções encontradas:', maintenances.length)

    while (currentDate <= endDate) {
      // Define o início do dia atual (ex: 03:00 UTC)
      const currentDayStart = new Date(currentDate)
      
      // Define o fim do dia atual (ex: 02:59:59.999 UTC do dia seguinte)
      const currentDayEnd = new Date(currentDate)
      currentDayEnd.setUTCDate(currentDayEnd.getUTCDate() + 1)
      currentDayEnd.setUTCMilliseconds(-1)

      // 🔑 LÓGICA CORRIGIDA: só considera inoperante se a manutenção FOI INICIADA
      const activeMaintenance = maintenances.find((m) => {
        // ❌ Ignora manutenções que ainda não começaram
        if (!m.started_date) {
          return false
        }

        const maintenanceStart = new Date(m.started_date)
        // Se a manutenção começou antes do período do relatório, considera o início do período para cálculo
        // Mas para verificação de range, usa a data real

        // ✅ Usa endDate do relatório (não "hoje") para manutenções em aberto
        const maintenanceEnd = m.completed_date
          ? new Date(m.completed_date)
          : endDate

        const isWithinRange =
          currentDayStart <= maintenanceEnd && currentDayEnd >= maintenanceStart

        if (isWithinRange) {
          console.log(
            `✅ Dia ${currentDate.toISOString().split('T')[0]} está em manutenção REAL:`,
            {
              maintenanceId: m.id,
              started_date: m.started_date,
              completed_date: m.completed_date,
            },
          )
        }

        return isWithinRange
      })
      
      // Ajusta a data para exibição (subtrai 3h para pegar o dia correto em PT-BR se necessário, ou usa UTC)
      // Como o input já está deslocado (03:00), o dia UTC pode ser o dia correto se for 03:00 do dia X.
      // 03:00 do dia 01/01 é 01/01.
      const dateString = currentDate.toISOString().split('T')[0]

      dailyStatus.push({
        date: dateString, 
        status: activeMaintenance ? 'INOPERATIVE' : 'OPERATIVE',
        maintenanceId: activeMaintenance?.id || null,
      })

      // Avança 1 dia (mantendo o offset de horas, ex: 03:00 -> 03:00 do próx dia)
      currentDate.setUTCDate(currentDate.getUTCDate() + 1)
    }

    const totalMaintenances = maintenances.length
    const totalDays = dailyStatus.length
    const operativeDays = dailyStatus.filter(
      (d) => d.status === 'OPERATIVE',
    ).length
    const inoperativeDays = totalDays - operativeDays

    console.log('📊 Resumo gerado:', {
      totalMaintenances,
      totalDays,
      operativeDays,
      inoperativeDays,
      dailyStatusSample: dailyStatus.slice(0, 3),
    })

    return {
      maintenances,
      summary: {
        totalMaintenances,
        totalDays,
        operativeDays,
        inoperativeDays,
      },
      dailyStatus,
    }
  }
}
