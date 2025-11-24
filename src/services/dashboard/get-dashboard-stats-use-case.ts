import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface DashboardStatsResponse {
  totalMonthlyExpense: number
  previousMonthExpense: number
  expenseVariation: number
  expenseVariationPercent: number
  equipmentsInMaintenance: number
  vehiclesUnavailable: number
  dailyExpenses: Array<{
    date: string
    expense: number
  }>
  expensesByEquipment: Array<{
    name: string
    value: number
  }>
}

export class GetDashboardStatsUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
  ) {}

  async execute(): Promise<DashboardStatsResponse> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Buscar todas as manutenções (buscar múltiplas páginas se necessário)
    let allMaintenancesItems: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const result = await this.maintenanceRepository.findAll(page)
      allMaintenancesItems = [...allMaintenancesItems, ...result.items]
      hasMore = result.currentPage < result.totalPages
      page++
    }

    // Manutenções do mês atual (completadas ou em progresso)
    const currentMonthMaintenances = allMaintenancesItems.filter(m => {
      const scheduledDate = new Date(m.scheduled_date)
      return scheduledDate >= startOfMonth && 
             (m.status === 'COMPLETED' || m.status === 'IN_PROGRESS')
    })

    // Manutenções do mês anterior
    const previousMonthMaintenances = allMaintenancesItems.filter(m => {
      const scheduledDate = new Date(m.scheduled_date)
      return scheduledDate >= startOfPreviousMonth && 
             scheduledDate <= endOfPreviousMonth &&
             (m.status === 'COMPLETED' || m.status === 'IN_PROGRESS')
    })

    // Calcular despesas
    const totalMonthlyExpense = currentMonthMaintenances.reduce((sum, m) => {
      return sum + (Number(m.actual_cost) || Number(m.estimated_cost) || 0)
    }, 0)

    const previousMonthExpense = previousMonthMaintenances.reduce((sum, m) => {
      return sum + (Number(m.actual_cost) || Number(m.estimated_cost) || 0)
    }, 0)

    const expenseVariation = totalMonthlyExpense - previousMonthExpense
    const expenseVariationPercent = previousMonthExpense > 0 
      ? (expenseVariation / previousMonthExpense) * 100 
      : 0

    // Equipamentos em manutenção (status IN_PROGRESS)
    const equipmentsInMaintenance = allMaintenancesItems.filter(
      m => m.status === 'IN_PROGRESS'
    ).length

    // Buscar assets para contar veículos indisponíveis
    let allAssetsItems: any[] = []
    let assetPage = 1
    let hasMoreAssets = true

    while (hasMoreAssets) {
      const result = await this.assetRepository.findAll(assetPage)
      allAssetsItems = [...allAssetsItems, ...result.items]
      hasMoreAssets = result.currentPage < result.totalPages
      assetPage++
    }

    const assetsInMaintenance = allMaintenancesItems
      .filter(m => m.status === 'IN_PROGRESS' || m.status === 'SCHEDULED')
      .map(m => m.assetId)
    
    // Contar veículos (assets com tipo VEHICLE) em manutenção
    const vehiclesUnavailable = allAssetsItems.filter(asset => {
      const assetCategory = asset.assetCategory
      return assetCategory?.type === 'VEHICLE' && 
             assetsInMaintenance.includes(asset.id)
    }).length

    // Despesas diárias do mês atual (últimos 30 dias)
    const dailyExpensesMap = new Map<string, number>()
    const daysAgo30 = new Date(now)
    daysAgo30.setDate(daysAgo30.getDate() - 30)

    const recentMaintenances = allMaintenancesItems.filter(m => {
      const scheduledDate = new Date(m.scheduled_date)
      return scheduledDate >= daysAgo30 && 
             (m.status === 'COMPLETED' || m.status === 'IN_PROGRESS')
    })

    recentMaintenances.forEach(m => {
      const date = new Date(m.scheduled_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
      const cost = Number(m.actual_cost) || Number(m.estimated_cost) || 0
      const current = dailyExpensesMap.get(date) || 0
      dailyExpensesMap.set(date, current + cost)
    })

    const dailyExpenses = Array.from(dailyExpensesMap.entries())
      .map(([date, expense]) => ({ date, expense }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number)
        const [dayB, monthB] = b.date.split('/').map(Number)
        if (monthA !== monthB) return monthA - monthB
        return dayA - dayB
      })

    // Despesas por equipamento (top 4)
    const expensesByEquipmentMap = new Map<string, number>()
    
    for (const m of currentMonthMaintenances) {
      const asset = allAssetsItems.find(a => a.id === m.assetId)
      if (asset) {
        const assetName = `${asset.brand} ${asset.model}`
        const cost = Number(m.actual_cost) || Number(m.estimated_cost) || 0
        const current = expensesByEquipmentMap.get(assetName) || 0
        expensesByEquipmentMap.set(assetName, current + cost)
      }
    }

    const expensesByEquipment = Array.from(expensesByEquipmentMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)

    return {
      totalMonthlyExpense,
      previousMonthExpense,
      expenseVariation,
      expenseVariationPercent,
      equipmentsInMaintenance,
      vehiclesUnavailable,
      dailyExpenses,
      expensesByEquipment,
    }
  }
}

