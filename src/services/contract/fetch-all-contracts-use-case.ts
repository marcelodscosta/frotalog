import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchAllContractsRequest {
  page: number
}

interface FetchAllContractsResponse {
  contracts: PaginatedResult<Contract>
}

export class FetchAllContractsUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    page,
  }: FetchAllContractsRequest): Promise<FetchAllContractsResponse> {
    const contracts = await this.contractRepository.findAll(page)

    return {
      contracts,
    }
  }
}
