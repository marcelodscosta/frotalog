import { PayableExpenseWithRelations, IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'

interface ListExpensesRequest {
  page: number
  status?: string
}

interface ListExpensesResponse {
  expenses: PayableExpenseWithRelations[]
  total: number
}

export class ListExpensesUseCase {
  constructor(private payableExpenseRepository: IPayableExpenseRepository) {}

  async execute(data: ListExpensesRequest): Promise<ListExpensesResponse> {
    const { data: expenses, total } = await this.payableExpenseRepository.findAll(data.page, data.status)
    return { expenses, total }
  }
}
