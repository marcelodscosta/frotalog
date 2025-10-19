import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface MaintenanceReportRequest {
  startDate?: Date
  endDate?: Date
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  type?: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY'
  assetId?: string
  supplierId?: string
}

interface MaintenanceReportResponse {
  summary: {
    total: number
    scheduled: number
    inProgress: number
    completed: number
    cancelled: number
    totalCost: number
    averageCost: number
  }
  byType: {
    preventive: number
    corrective: number
    emergency: number
  }
  byStatus: {
    scheduled: number
    inProgress: number
    completed: number
    cancelled: number
  }
  maintenances: Array<{
    id: string
    type: string
    status: string
    description: string
    scheduled_date: Date
    estimated_cost: number | null
    actual_cost: number | null
    asset: {
      id: string
      brand: string
      model: string
      plate: string | null
    }
    supplier: {
      id: string
      company_name: string
    }
  }>
}

export class MaintenanceReportUseCase {
  constructor(
    private maintenanceRepository: IMaintenanceRepository,
    private assetRepository: IAssetRepository,
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(filters: MaintenanceReportRequest): Promise<MaintenanceReportResponse> {
    // Buscar todas as manutenções com filtros
    const allMaintenances = await this.maintenanceRepository.findAll(1)
    
    // Aplicar filtros
    let filteredMaintenances = allMaintenances.items

    if (filters.startDate) {
      filteredMaintenances = filteredMaintenances.filter(
        m => m.scheduled_date >= filters.startDate!
      )
    }

    if (filters.endDate) {
      filteredMaintenances = filteredMaintenances.filter(
        m => m.scheduled_date <= filters.endDate!
      )
    }

    if (filters.status) {
      filteredMaintenances = filteredMaintenances.filter(
        m => m.status === filters.status
      )
    }

    if (filters.type) {
      filteredMaintenances = filteredMaintenances.filter(
        m => m.type === filters.type
      )
    }

    if (filters.assetId) {
      filteredMaintenances = filteredMaintenances.filter(
        m => m.assetId === filters.assetId
      )
    }

    if (filters.supplierId) {
      filteredMaintenances = filteredMaintenances.filter(
        m => m.supplierId === filters.supplierId
      )
    }

    // Calcular estatísticas
    const total = filteredMaintenances.length
    const scheduled = filteredMaintenances.filter(m => m.status === 'SCHEDULED').length
    const inProgress = filteredMaintenances.filter(m => m.status === 'IN_PROGRESS').length
    const completed = filteredMaintenances.filter(m => m.status === 'COMPLETED').length
    const cancelled = filteredMaintenances.filter(m => m.status === 'CANCELLED').length

    const totalCost = filteredMaintenances.reduce((sum, m) => {
      return sum + (Number(m.actual_cost) || Number(m.estimated_cost) || 0)
    }, 0)

    const averageCost = total > 0 ? totalCost / total : 0

    const byType = {
      preventive: filteredMaintenances.filter(m => m.type === 'PREVENTIVE').length,
      corrective: filteredMaintenances.filter(m => m.type === 'CORRECTIVE').length,
      emergency: filteredMaintenances.filter(m => m.type === 'EMERGENCY').length,
    }

    const byStatus = {
      scheduled,
      inProgress,
      completed,
      cancelled,
    }

    // Buscar dados relacionados (asset e supplier) para cada manutenção
    const maintenancesWithDetails = await Promise.all(
      filteredMaintenances.map(async (maintenance) => {
        const asset = await this.assetRepository.findById(maintenance.assetId)
        const supplier = await this.supplierRepository.findById(maintenance.supplierId)

        return {
          id: maintenance.id,
          type: maintenance.type,
          status: maintenance.status,
          description: maintenance.description,
          scheduled_date: maintenance.scheduled_date,
          estimated_cost: maintenance.estimated_cost ? Number(maintenance.estimated_cost) : null,
          actual_cost: maintenance.actual_cost ? Number(maintenance.actual_cost) : null,
          asset: {
            id: asset?.id || '',
            brand: asset?.brand || '',
            model: asset?.model || '',
            plate: asset?.plate || null,
          },
          supplier: {
            id: supplier?.id || '',
            company_name: supplier?.company_name || '',
          },
        }
      })
    )

    return {
      summary: {
        total,
        scheduled,
        inProgress,
        completed,
        cancelled,
        totalCost,
        averageCost,
      },
      byType,
      byStatus,
      maintenances: maintenancesWithDetails,
    }
  }
}
