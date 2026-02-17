import { prisma } from '../../lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

interface MaintenanceFinancialReportRequest {
  startDate: Date
  endDate: Date
  groupBy?: 'ASSET' | 'SUPPLIER'
}

export class MaintenanceFinancialReportUseCase {
  async execute({ startDate, endDate, groupBy = 'ASSET' }: MaintenanceFinancialReportRequest) {
    // 1. Fetch completed maintenances in range
    const maintenances = await prisma.maintenance.findMany({
      where: {
        completed_date: {
            gte: startOfDay(startDate),
            lte: endOfDay(endDate),
        },
        status: 'COMPLETED',
        is_Active: true
      },
      select: {
        id: true,
        actual_cost: true,
        asset: {
          select: {
            id: true,
            plate: true,
            model: true,
            brand: true,
          },
        },
        supplier: {
          select: {
            id: true,
            company_name: true,
            trading_name: true,
          },
        },
      },
    })

    // 2. Aggregate Data
    const report = new Map<string, {
      id: string
      name: string
      count: number
      totalCost: number
    }>()

    for (const maintenance of maintenances) {
        // Explicitly cast or handle potential nulls if types are strict
        const cost = Number(maintenance.actual_cost || 0)
        let key = ''
        let name = ''
        let id = ''
        
        // Use 'asset' and 'supplier' from the select structure
        const asset = maintenance.asset
        const supplier = maintenance.supplier

        if (groupBy === 'ASSET') {
            key = asset.id
            id = asset.id
            name = `${asset.brand} ${asset.model} - ${asset.plate || 'S/P'}`
        } else {
            key = supplier?.id || 'unknown'
            id = supplier?.id || 'unknown'
            name = supplier?.trading_name || supplier?.company_name || 'Sem Fornecedor'
        }

        const existing = report.get(key)
        if (existing) {
            existing.count += 1
            existing.totalCost += cost
        } else {
            report.set(key, {
                id,
                name,
                count: 1,
                totalCost: cost
            })
        }
    }

    return {
        report: Array.from(report.values()).sort((a, b) => b.totalCost - a.totalCost),
        totalOverall: Array.from(report.values()).reduce((acc, curr) => acc + curr.totalCost, 0)
    }
  }
}
