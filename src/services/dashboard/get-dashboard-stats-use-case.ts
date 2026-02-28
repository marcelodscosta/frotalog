import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'

interface DashboardStatsResponse {
  totalMonthlyExpense: number
  previousMonthExpense: number
  expenseVariation: number
  expenseVariationPercent: number
  totalEstimatedCost: number
  totalActualCost: number
  costDifference: number
  equipmentsInMaintenance: number
  vehiclesUnavailable: number
  totalVehicles: number
  fleetAvailability: number
  dailyExpenses: Array<{
    date: string
    expense: number
    maintenances: Array<{
      plate?: string
      assetName?: string
      expense: number
    }>
  }>
  expensesByEquipment: Array<{
    name: string
    value: number
  }>
  expensesByType: Array<{
    name: string
    value: number
  }>
  equipmentMaintenanceDetails: Array<{
    categoryName: string
    assets: Array<{
      name: string
      plate?: string
      contractName?: string
      status: 'AVAILABLE' | 'RENTED' | 'IN_MAINTENANCE'
    }>
  }>
  fleetAvailabilityDetails: Array<{
    categoryName: string
    assets: Array<{
      name: string
      plate?: string
      status: 'AVAILABLE' | 'RENTED'
      contractName?: string
    }>
  }>
}

interface GetDashboardStatsRequest {
  startDate?: string
  endDate?: string
  month?: number
  year?: number
}

export class GetDashboardStatsUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
    private assetMovementRepository: IAssetMovementRepository,
  ) {}

  async execute(
    params?: GetDashboardStatsRequest,
  ): Promise<DashboardStatsResponse> {
    const now = new Date()

    // Determinar período baseado nos parâmetros
    let startOfMonth: Date
    let endOfMonth: Date
    let startOfPreviousMonth: Date
    let endOfPreviousMonth: Date

    if (params?.startDate && params?.endDate) {
      // Período customizado
      startOfMonth = new Date(params.startDate)
      startOfMonth.setHours(0, 0, 0, 0)
      endOfMonth = new Date(params.endDate)
      endOfMonth.setHours(23, 59, 59, 999)
      // Para período customizado, calcular período anterior equivalente
      const periodDays = Math.ceil(
        (endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24),
      )
      endOfPreviousMonth = new Date(startOfMonth)
      endOfPreviousMonth.setDate(endOfPreviousMonth.getDate() - 1)
      endOfPreviousMonth.setHours(23, 59, 59, 999)
      startOfPreviousMonth = new Date(endOfPreviousMonth)
      startOfPreviousMonth.setDate(startOfPreviousMonth.getDate() - periodDays)
      startOfPreviousMonth.setHours(0, 0, 0, 0)
    } else if (params?.month && params?.year) {
      // Mês e ano específicos
      startOfMonth = new Date(params.year, params.month - 1, 1)
      startOfMonth.setHours(0, 0, 0, 0)
      endOfMonth = new Date(params.year, params.month, 0)
      endOfMonth.setHours(23, 59, 59, 999)
      startOfPreviousMonth = new Date(params.year, params.month - 2, 1)
      startOfPreviousMonth.setHours(0, 0, 0, 0)
      endOfPreviousMonth = new Date(params.year, params.month - 1, 0)
      endOfPreviousMonth.setHours(23, 59, 59, 999)
    } else {
      // Mês atual (padrão)
      startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      startOfMonth.setHours(0, 0, 0, 0)
      endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)
      startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      startOfPreviousMonth.setHours(0, 0, 0, 0)
      endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      endOfPreviousMonth.setHours(23, 59, 59, 999)
    }

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

    // Manutenções do período selecionado (completadas - apenas com actual_cost)
    const currentMonthMaintenances = allMaintenancesItems.filter((m) => {
      const completedDate = m.completed_date
        ? new Date(m.completed_date)
        : new Date(m.scheduled_date)
      return (
        completedDate >= startOfMonth &&
        completedDate <= endOfMonth &&
        m.status === 'COMPLETED' &&
        m.actual_cost !== null
      )
    })

    // Manutenções do mês anterior (apenas completadas com actual_cost)
    const previousMonthMaintenances = allMaintenancesItems.filter((m) => {
      const completedDate = m.completed_date
        ? new Date(m.completed_date)
        : new Date(m.scheduled_date)
      return (
        completedDate >= startOfPreviousMonth &&
        completedDate <= endOfPreviousMonth &&
        m.status === 'COMPLETED' &&
        m.actual_cost !== null
      )
    })

    // Calcular despesas (usar apenas actual_cost, não estimated_cost)
    const totalMonthlyExpense = currentMonthMaintenances.reduce((sum, m) => {
      return sum + (Number(m.actual_cost) || 0)
    }, 0)

    const previousMonthExpense = previousMonthMaintenances.reduce((sum, m) => {
      return sum + (Number(m.actual_cost) || 0)
    }, 0)

    const expenseVariation = totalMonthlyExpense - previousMonthExpense
    const expenseVariationPercent =
      previousMonthExpense > 0
        ? (expenseVariation / previousMonthExpense) * 100
        : 0

    // Calcular custo estimado total e diferença
    const totalEstimatedCost = currentMonthMaintenances.reduce((sum, m) => {
      return sum + (Number(m.estimated_cost) || 0)
    }, 0)

    const totalActualCost = totalMonthlyExpense

    // Diferença: positivo = economizou (gastou menos que o estimado), negativo = gastou mais
    const costDifference = totalEstimatedCost - totalActualCost

    // Equipamentos em manutenção (status IN_PROGRESS) - contar equipamentos únicos
    const inProgressMaintenances = allMaintenancesItems.filter(
      (m) => m.status === 'IN_PROGRESS'
    )
    
    const uniqueEquipmentsInMaintenance = new Set(
      inProgressMaintenances.map((m) => m.assetId),
    )
    const equipmentsInMaintenance = uniqueEquipmentsInMaintenance.size

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

    // Equipamentos com manutenção em progresso (IDs únicos)
    const uniqueAssetsInMaintenance = new Set(
      allMaintenancesItems
        .filter((m) => m.status === 'IN_PROGRESS')
        .map((m) => m.assetId),
    )

    // Contar veículos (assets com tipo VEHICLE) em manutenção
    let totalVehicles = 0
    const vehiclesUnavailable = allAssetsItems.filter((asset) => {
      const assetCategory = asset.assetCategory
      if (assetCategory?.type === 'VEHICLE') {
        totalVehicles++
        return uniqueAssetsInMaintenance.has(asset.id)
      }
      return false
    }).length

    const fleetAvailability = totalVehicles > 0 ? ((totalVehicles - vehiclesUnavailable) / totalVehicles) * 100 : 0

    // Modals Data
    let allActiveMovementsItems: any[] = []
    
    // Fetch active movements using search
    let movPage = 1
    let hasMoreMovs = true
    while (hasMoreMovs) {
      if (typeof this.assetMovementRepository.search === 'function') {
        const result = await this.assetMovementRepository.search({ isActive: true, page: movPage })
        allActiveMovementsItems = [...allActiveMovementsItems, ...result.items]
        hasMoreMovs = result.currentPage < result.totalPages
      } else {
        hasMoreMovs = false // safe fallback
      }
      movPage++
    }

    // 1. Equipment in Maintenance Details
    const equipmentMaintenanceMap = new Map<string, Array<any>>()

    Array.from(uniqueEquipmentsInMaintenance).forEach(assetId => {
      const asset = allAssetsItems.find(a => a.id === assetId)
      
      const categoryName = asset?.assetCategory?.name || 'Sem Categoria'
      
      // Look for active movement to get contract
      const activeMovement = allActiveMovementsItems.find(m => m.assetId === assetId && !m.demobilization_date)
      let contractName = undefined
      if (activeMovement && activeMovement.contract && activeMovement.contract.client) {
        contractName = activeMovement.contract.client.company_name
      } else if (activeMovement && activeMovement.contract) {
         contractName = activeMovement.contract.contract_number // fallback if client not included
      }

      const equipDetail = {
        name: asset ? `${asset.brand} ${asset.model}` : 'Desconhecido',
        plate: asset?.plate || undefined,
        status: 'IN_MAINTENANCE',
        contractName
      }

      if (!equipmentMaintenanceMap.has(categoryName)) {
        equipmentMaintenanceMap.set(categoryName, [])
      }
      equipmentMaintenanceMap.get(categoryName)!.push(equipDetail)
    })

    const equipmentMaintenanceDetails = Array.from(equipmentMaintenanceMap.entries()).map(([categoryName, assets]) => ({
      categoryName,
      assets
    }))

    // 2. Fleet Availability Details
    const fleetAvailabilityMap = new Map<string, Array<any>>()

    allAssetsItems.forEach(asset => {
      if (!asset.is_Active) return
      
      const categoryName = asset.assetCategory?.name || 'Sem Categoria'
      let status: 'AVAILABLE' | 'RENTED' = 'AVAILABLE'
      let contractName = undefined

      const activeMovement = allActiveMovementsItems.find(m => m.assetId === asset.id && !m.demobilization_date)
      if (activeMovement) {
        status = 'RENTED'
        if (activeMovement.contract && activeMovement.contract.client) {
          contractName = activeMovement.contract.client.company_name
        } else if (activeMovement.contract) {
          contractName = activeMovement.contract.contract_number
        }
      }

      const assetDetail = {
        name: `${asset.brand} ${asset.model}`,
        plate: asset.plate || undefined,
        status,
        contractName
      }

      if (!fleetAvailabilityMap.has(categoryName)) {
        fleetAvailabilityMap.set(categoryName, [])
      }
      fleetAvailabilityMap.get(categoryName)!.push(assetDetail)
    })

    const fleetAvailabilityDetails = Array.from(fleetAvailabilityMap.entries()).map(([categoryName, assets]) => ({
      categoryName,
      assets
    }))

    // Despesas diárias do período selecionado (agrupando múltiplas manutenções por data)
    const dailyExpensesMap = new Map<
      string,
      {
        totalExpense: number
        maintenances: Array<{
          plate?: string
          assetName?: string
          expense: number
        }>
      }
    >()

    const periodStart = params?.startDate
      ? new Date(params.startDate)
      : params?.month && params?.year
        ? new Date(params.year, params.month - 1, 1)
        : new Date(now.getFullYear(), now.getMonth(), 1)
    const periodEnd = params?.endDate
      ? new Date(params.endDate)
      : params?.month && params?.year
        ? new Date(params.year, params.month, 0)
        : new Date(now)

    const recentMaintenances = allMaintenancesItems.filter((m) => {
      const completedDate = m.completed_date
        ? new Date(m.completed_date)
        : new Date(m.scheduled_date)
      return (
        completedDate >= periodStart &&
        completedDate <= periodEnd &&
        m.status === 'COMPLETED' &&
        m.actual_cost !== null
      )
    })

    recentMaintenances.forEach((m) => {
      const date = new Date(m.scheduled_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })
      const cost = Number(m.actual_cost) || 0

      // Buscar informações do asset
      const asset = allAssetsItems.find((a) => a.id === m.assetId)
      const plate = asset?.plate || undefined
      const assetName = asset ? `${asset.brand} ${asset.model}` : undefined

      // Obter ou criar entrada para esta data
      const current = dailyExpensesMap.get(date) || {
        totalExpense: 0,
        maintenances: [],
      }

      // Adicionar esta manutenção à lista
      current.maintenances.push({
        plate,
        assetName,
        expense: cost,
      })
      current.totalExpense += cost

      dailyExpensesMap.set(date, current)
    })

    const dailyExpenses = Array.from(dailyExpensesMap.entries())
      .map(([date, data]) => ({
        date,
        expense: data.totalExpense,
        maintenances: data.maintenances,
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number)
        const [dayB, monthB] = b.date.split('/').map(Number)
        if (monthA !== monthB) return monthA - monthB
        return dayA - dayB
      })

    // Despesas por equipamento (top 4)
    const expensesByEquipmentMap = new Map<string, number>()

    for (const m of currentMonthMaintenances) {
      const asset = allAssetsItems.find((a) => a.id === m.assetId)
      if (asset) {
        let assetName = `${asset.brand} ${asset.model}`
        const isVehicle = asset.assetCategory?.type === 'VEHICLE'
        
        if (isVehicle && asset.plate) {
          assetName += ` - Placa: ${asset.plate}`
        } else if (!isVehicle && asset.serial_number) {
          assetName += ` - SN: ${asset.serial_number}`
        }

        const cost = Number(m.actual_cost) || 0
        const current = expensesByEquipmentMap.get(assetName) || 0
        expensesByEquipmentMap.set(assetName, current + cost)
      }
    }

    const expensesByEquipment = Array.from(expensesByEquipmentMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    // Despesas por tipo de manutenção
    const expensesByTypeMap = new Map<string, number>()
    expensesByTypeMap.set('PREVENTIVE', 0)
    expensesByTypeMap.set('CORRECTIVE', 0)
    expensesByTypeMap.set('EMERGENCY', 0)

    for (const m of currentMonthMaintenances) {
      if (m.type) {
        const cost = Number(m.actual_cost) || 0
        const current = expensesByTypeMap.get(m.type) || 0
        expensesByTypeMap.set(m.type, current + cost)
      }
    }

    const expensesByType = Array.from(expensesByTypeMap.entries()).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }))

    return {
      totalMonthlyExpense,
      previousMonthExpense,
      expenseVariation,
      expenseVariationPercent,
      totalEstimatedCost,
      totalActualCost,
      costDifference,
      equipmentsInMaintenance,
      vehiclesUnavailable,
      totalVehicles,
      fleetAvailability,
      equipmentMaintenanceDetails,
      fleetAvailabilityDetails,
      dailyExpenses,
      expensesByEquipment,
      expensesByType,
    }
  }
}
