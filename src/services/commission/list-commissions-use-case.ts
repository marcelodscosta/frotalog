import { Commission, CommissionStatus } from '../../generated/prisma'
import { ICommissionRepository, CommissionFilters } from '../../repositories/interfaces/ICommissionRepository'

interface ListCommissionsRequest extends CommissionFilters {
  page?: number
}

interface ListCommissionsResponse {
  items: Commission[]
  totalItems: number
  totalPages: number
  currentPage: number
  summary: {
    totalValue: number
    totalPending: number
    totalConfirmed: number
    totalPaid: number
    count: number
  }
}

export class ListCommissionsUseCase {
  constructor(private commissionRepository: ICommissionRepository) {}

  async execute(filters: ListCommissionsRequest): Promise<ListCommissionsResponse> {
    const [result, summary] = await Promise.all([
      this.commissionRepository.search(filters),
      this.commissionRepository.getSummary(filters),
    ])

    return { ...result, summary }
  }
}
