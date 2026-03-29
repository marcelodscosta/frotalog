import { PayableExpenseWithRelations, IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'

interface ListPendingApprovalsRequest {
  level: 'MAINTENANCE' | 'FINANCE' | 'DIRECTOR'
}

const STATUS_MAP: Record<string, string> = {
  MAINTENANCE: 'PENDING_MAINTENANCE_APPROVAL',
  FINANCE: 'PENDING_FINANCE_APPROVAL',
  DIRECTOR: 'PENDING_DIRECTOR_APPROVAL',
}

interface ListPendingApprovalsResponse {
  expenses: PayableExpenseWithRelations[]
}

export class ListPendingApprovalsUseCase {
  constructor(private payableExpenseRepository: IPayableExpenseRepository) {}

  async execute(data: ListPendingApprovalsRequest): Promise<ListPendingApprovalsResponse> {
    const status = STATUS_MAP[data.level]
    const expenses = await this.payableExpenseRepository.findPendingByStatus(status)
    return { expenses }
  }
}
