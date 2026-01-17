import { Maintenance } from '../../generated/prisma'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'

interface MaintenanceByAssetRequest {
  assetId: string
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

    // Normaliza as datas de entrada para UTC 00:00:00.000 e 23:59:59.999
    const startDate = new Date(request.startDate)
    startDate.setUTCHours(0, 0, 0, 0)

    const endDate = new Date(request.endDate)
    endDate.setUTCHours(23, 59, 59, 999)

    const maintenances =
      await this.maintenanceRepository.findMaintenancesByAssetPeriod(
        request.assetId,
        startDate,
        endDate,
      )

    const dailyStatus: MaintenanceByAssetResponse['dailyStatus'] = []
    const currentDate = new Date(startDate)
    currentDate.setUTCHours(0, 0, 0, 0)

    console.log('📊 Gerando dailyStatus...')
    console.log('📋 Manutenções encontradas:', maintenances.length)

    while (currentDate <= endDate) {
      const currentDayStart = new Date(currentDate)
      currentDayStart.setUTCHours(0, 0, 0, 0)

      const currentDayEnd = new Date(currentDate)
      currentDayEnd.setUTCHours(23, 59, 59, 999)

      // 🔑 LÓGICA CORRIGIDA: só considera inoperante se a manutenção FOI INICIADA
      const activeMaintenance = maintenances.find((m) => {
        // ❌ Ignora manutenções que ainda não começaram
        if (!m.started_date) {
          return false
        }

        const maintenanceStart = new Date(m.started_date)
        maintenanceStart.setUTCHours(0, 0, 0, 0)

        // ✅ Usa endDate do relatório (não "hoje") para manutenções em aberto
        const maintenanceEnd = m.completed_date
          ? new Date(m.completed_date)
          : endDate // ← importante para consistência histórica
        maintenanceEnd.setUTCHours(23, 59, 59, 999)

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

      dailyStatus.push({
        date: currentDate.toISOString().split('T')[0], // ✅ Formato ISO apenas da data (sem hora)
        status: activeMaintenance ? 'INOPERATIVE' : 'OPERATIVE',
        maintenanceId: activeMaintenance?.id || null,
      })

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
