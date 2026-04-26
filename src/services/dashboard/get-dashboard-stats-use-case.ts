import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IFinancialTransactionRepository } from '../../repositories/interfaces/IFinancialTransactionRepository'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { prisma } from '../../lib/prisma'

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
  interventionsByType: {
    preventive: number
    corrective: number
    emergency: number
    total: number
  }
  fleetAvailabilityDetails: Array<{
    categoryName: string
    assets: Array<{
      name: string
      plate?: string
      status: 'AVAILABLE' | 'RENTED'
      contractName?: string
    }>
  }>
  expenseDetails: Array<{
    id: string
    description: string
    value: number
    date: string
    assetName: string
    categoryName: string
  }>
}

interface GetDashboardStatsRequest {
  startDate?: string
  endDate?: string
  month?: number
  year?: number
  contractId?: string
}

export class GetDashboardStatsUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
    private assetMovementRepository: IAssetMovementRepository,
    private financialTransactionRepository: IFinancialTransactionRepository,
    private payableExpenseRepository: IPayableExpenseRepository,
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
      startOfMonth.setUTCHours(0, 0, 0, 0)
      endOfMonth = new Date(params.endDate)
      endOfMonth.setUTCHours(23, 59, 59, 999)
      
      const periodDays = Math.ceil(
        (endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24),
      )
      endOfPreviousMonth = new Date(startOfMonth)
      endOfPreviousMonth.setUTCDate(endOfPreviousMonth.getUTCDate() - 1)
      endOfPreviousMonth.setUTCHours(23, 59, 59, 999)
      startOfPreviousMonth = new Date(endOfPreviousMonth)
      startOfPreviousMonth.setUTCDate(startOfPreviousMonth.getUTCDate() - periodDays)
      startOfPreviousMonth.setUTCHours(0, 0, 0, 0)
    } else if (params?.month && params?.year) {
      // Mês e ano específicos
      startOfMonth = new Date(Date.UTC(params.year, params.month - 1, 1, 0, 0, 0, 0))
      endOfMonth = new Date(Date.UTC(params.year, params.month, 0, 23, 59, 59, 999))
      startOfPreviousMonth = new Date(Date.UTC(params.year, params.month - 2, 1, 0, 0, 0, 0))
      endOfPreviousMonth = new Date(Date.UTC(params.year, params.month - 1, 0, 23, 59, 59, 999))
    } else {
      // Mês atual (padrão)
      const currentYear = now.getUTCFullYear()
      const currentMonth = now.getUTCMonth()
      startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0))
      endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999))
      startOfPreviousMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0))
      endOfPreviousMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999))
    }

    // Buscar todas as manutenções (buscar múltiplas páginas se necessário)
    let allMaintenancesItems: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const result = await this.maintenanceRepository.findAll({ page })
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

    // Determinar mês/ano para os repositórios (usar params se houver, senão calcular do startOfMonth)
    const currentMonthNum = params?.month || (startOfMonth.getUTCMonth() + 1)
    const currentYearNum = params?.year || startOfMonth.getUTCFullYear()
    
    // Calcular mês anterior para o repositório
    let prevMonthNum = currentMonthNum - 1
    let prevYearNum = currentYearNum
    if (prevMonthNum === 0) {
      prevMonthNum = 12
      prevYearNum--
    }

    // 1. Somar as despesas de Manutenção/Reparos LANÇADAS no mês
    const currentMonthSummary = await this.payableExpenseRepository.getSummary(
      currentMonthNum,
      currentYearNum,
    )
    
    const totalMonthlyExpense = currentMonthSummary.total

    // Repetir para o mês anterior
    const previousMonthSummary = await this.payableExpenseRepository.getSummary(
      prevMonthNum,
      prevYearNum,
    )

    const previousMonthExpense = previousMonthSummary.total

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

    // Equipamentos em manutenção (status IN_PROGRESS e is_Active = true) - contar equipamentos únicos
    const inProgressMaintenances = allMaintenancesItems.filter(
      (m) => m.status === 'IN_PROGRESS' && m.is_Active === true
    )
    
    const uniqueAssetsInMaintenanceIds = new Set(
      inProgressMaintenances.map((m) => m.assetId),
    )

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

    // Contar todos os assets ativos (veículos + equipamentos) em manutenção
    // Cruzar com allAssetsItems para garantir que o asset ainda está ativo
    let totalVehicles = 0
    const vehiclesUnavailable = allAssetsItems.filter((asset) => {
      if (asset.is_Active) {
        totalVehicles++
        return uniqueAssetsInMaintenanceIds.has(asset.id)
      }
      return false
    }).length

    // equipmentsInMaintenance = todos os assets com manutenção IN_PROGRESS ativa,
    // independente de o asset estar ativo ou não (para bater com o modal)
    const equipmentsInMaintenance = uniqueAssetsInMaintenanceIds.size

    const fleetAvailability = totalVehicles > 0 ? ((totalVehicles - vehiclesUnavailable) / totalVehicles) * 100 : 0

    // Buscar todos os movimentos ativos (usados nos modals e no filtro de intervenções por contrato)
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

    // Mapa: assetId → Set de contractIds (via movimentos) para filtro de intervenções
    const assetToContractsMap = new Map<string, Set<string>>()
    allActiveMovementsItems.forEach((mov: any) => {
      if (!mov.contractId) return
      if (!assetToContractsMap.has(mov.assetId)) {
        assetToContractsMap.set(mov.assetId, new Set())
      }
      assetToContractsMap.get(mov.assetId)!.add(mov.contractId)
    })

    // 1. Equipment in Maintenance Details
    const equipmentMaintenanceMap = new Map<string, Array<any>>()

    Array.from(uniqueAssetsInMaintenanceIds).forEach(assetId => {
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

    // --- CÁLCULO DOS GRÁFICOS E DETALHAMENTO (Unificado via Repositório) ---
    const monthExpenses = currentMonthSummary.details || []

    // 1. Gráfico de Despesas por Equipamento
    const equipmentExpensesMap = new Map<string, number>()
    for (const exp of monthExpenses) {
      let assetName = 'Outros / Sem OS'
      
      if (exp.maintenance?.asset) {
        assetName = `${exp.maintenance.asset.brand} ${exp.maintenance.asset.model}${exp.maintenance.asset.plate ? ` - ${exp.maintenance.asset.plate}` : ''}`
      } else {
        // Tentativa de identificar o veículo pela descrição
        const description = exp.description.toUpperCase()
        const matchedAsset = allAssetsItems.find(a => 
          (a.plate && description.includes(a.plate.toUpperCase())) ||
          (a.serial_number && description.includes(a.serial_number.toUpperCase())) ||
          description.includes(`${a.brand.toUpperCase()} ${a.model.toUpperCase()}`)
        )
        
        if (matchedAsset) {
          assetName = `${matchedAsset.brand} ${matchedAsset.model}${matchedAsset.plate ? ` - ${matchedAsset.plate}` : ''}`
        }
      }
      
      const current = equipmentExpensesMap.get(assetName) || 0
      equipmentExpensesMap.set(assetName, current + exp.total_value)
    }

    const expensesByEquipment = Array.from(equipmentExpensesMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // 2. Gráfico de Despesas por Categoria (Tipo)
    const typeExpensesMap = new Map<string, number>()
    for (const exp of monthExpenses) {
      let typeName = 'OUTROS'
      if (exp.maintenance?.type) {
        typeName = exp.maintenance.type
      } else if (exp.chartOfAccount?.code === '2.1.1') {
        typeName = 'PREVENTIVE'
      } else if (exp.chartOfAccount?.code === '2.1.2') {
        typeName = 'CORRECTIVE'
      } else if (exp.chartOfAccount?.code === '2.1.4') {
        typeName = 'PNEUS/BORRACHARIA'
      }

      const current = typeExpensesMap.get(typeName) || 0
      typeExpensesMap.set(typeName, current + exp.total_value)
    }

    const expensesByType = Array.from(typeExpensesMap.entries())
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }))

    // 3. Detalhamento de Despesas para o Modal (Agrupado por Veículo)
    const expenseDetails = monthExpenses.map(exp => {
      let assetName = 'Sem Veículo Vinculado'
      
      if (exp.maintenance?.asset) {
        assetName = `${exp.maintenance.asset.brand} ${exp.maintenance.asset.model}${exp.maintenance.asset.plate ? ` (${exp.maintenance.asset.plate})` : ''}`
      } else {
        // Tentativa de identificar o veículo pela descrição (caso não tenha OS vinculada)
        const description = exp.description.toUpperCase()
        const matchedAsset = allAssetsItems.find(a => 
          (a.plate && description.includes(a.plate.toUpperCase())) ||
          (a.serial_number && description.includes(a.serial_number.toUpperCase())) ||
          description.includes(`${a.brand.toUpperCase()} ${a.model.toUpperCase()}`)
        )
        
        if (matchedAsset) {
          assetName = `${matchedAsset.brand} ${matchedAsset.model}${matchedAsset.plate ? ` (${matchedAsset.plate})` : ''}`
        }
      }

      return {
        id: exp.id,
        description: exp.description,
        value: exp.total_value,
        date: exp.created_at.toISOString(),
        assetName,
        categoryName: exp.chartOfAccount?.name || 'Manutenção Geral'
      }
    })

    // Contagem de intervenções por tipo no período selecionado (com filtro opcional por contrato)
    // O filtro considera TANTO o contractId direto na manutenção
    // QUANTO se o asset está vinculado ao contrato via assetMovements (para manutenções sem contractId)
    const periodMaintenances = allMaintenancesItems.filter((m) => {
      if (!m.is_Active) return false
      if (params?.contractId) {
        const directMatch = m.contractId === params.contractId
        const assetContracts = assetToContractsMap.get(m.assetId)
        const assetMatch = assetContracts?.has(params.contractId) ?? false
        if (!directMatch && !assetMatch) return false
      }
      const refDate = m.started_date
        ? new Date(m.started_date)
        : new Date(m.scheduled_date)
      return refDate >= startOfMonth && refDate <= endOfMonth
    })

    const interventionsByType = {
      preventive: periodMaintenances.filter((m) => m.type === 'PREVENTIVE').length,
      corrective: periodMaintenances.filter((m) => m.type === 'CORRECTIVE').length,
      emergency: periodMaintenances.filter((m) => m.type === 'EMERGENCY').length,
      total: periodMaintenances.length,
    }

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
      interventionsByType,
      equipmentMaintenanceDetails,
      fleetAvailabilityDetails,
      dailyExpenses,
      expensesByEquipment,
      expensesByType,
      expenseDetails,
    }
  }
}
