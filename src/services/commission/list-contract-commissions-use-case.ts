import { Commission, Contract } from '../../generated/prisma'
import { ICommissionRepository } from '../../repositories/interfaces/ICommissionRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ListContractCommissionsRequest {
  contractId: string
}

interface ListContractCommissionsResponse {
  items: Commission[]
  summary: {
    totalValue: number
    totalPending: number
    totalConfirmed: number
    totalPaid: number
    count: number
  }
}

/**
 * Comissão recorrente: garante que exista uma linha por mês do contrato e
 * devolve o extrato mensal do contrato. O valor base de cada mês é informado
 * pelo usuário posteriormente; aqui a linha nasce zerada.
 */
export class ListContractCommissionsUseCase {
  constructor(
    private commissionRepository: ICommissionRepository,
    private contractRepository: IContractRepository,
  ) {}

  async execute({ contractId }: ListContractCommissionsRequest): Promise<ListContractCommissionsResponse> {
    const contract = await this.contractRepository.findById(contractId)
    if (!contract) throw new ResourceNotFoundError()

    const existing = await this.commissionRepository.listByContract(contractId)
    const missingMonths = this.getMissingMonths(contract, existing)

    for (const reference_month of missingMonths) {
      await this.commissionRepository.create({
        contractId,
        sellerId: contract.sellerId as string,
        reference_month,
        base_value: 0,
        commission_percentage: Number(contract.commission_percentage),
        commission_value: 0,
      })
    }

    const items = missingMonths.length > 0
      ? await this.commissionRepository.listByContract(contractId)
      : existing

    return { items, summary: this.buildSummary(items) }
  }

  /**
   * Meses sem lançamento, do início da comissão até o mês atual (ou até o fim
   * do contrato, se este terminar antes).
   */
  private getMissingMonths(contract: Contract, existing: Commission[]): Date[] {
    const percentage = Number(contract.commission_percentage ?? 0)
    if (!contract.sellerId || percentage <= 0) return []

    const start = contract.commission_start_date ?? contract.start_date
    if (!start) return []

    const now = new Date()
    const limit = contract.commission_end_date ?? contract.end_date ?? now

    const firstMonth = this.startOfMonth(start)
    const lastMonth = this.startOfMonth(limit < now ? limit : now)

    const existingMonths = new Set(existing.map(c => this.monthKey(c.reference_month)))
    const months: Date[] = []

    let cursor = firstMonth
    while (cursor <= lastMonth) {
      if (!existingMonths.has(this.monthKey(cursor))) months.push(cursor)
      cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1))
    }

    return months
  }

  private startOfMonth(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
  }

  private monthKey(date: Date): string {
    const d = new Date(date)
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`
  }

  private buildSummary(items: Commission[]) {
    const active = items.filter(c => c.status !== 'CANCELLED')

    return {
      totalValue: active.reduce((acc, c) => acc + Number(c.commission_value), 0),
      totalPending: this.sumByStatus(active, 'PENDING'),
      totalConfirmed: this.sumByStatus(active, 'CONFIRMED'),
      totalPaid: this.sumByStatus(active, 'PAID'),
      count: active.length,
    }
  }

  private sumByStatus(items: Commission[], status: Commission['status']): number {
    return items
      .filter(c => c.status === status)
      .reduce((acc, c) => acc + Number(c.commission_value), 0)
  }
}
