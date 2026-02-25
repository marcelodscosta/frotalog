import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'

interface FetchContractsByClientRequest {
  client: string
  page: number
}

interface FetchContractsByClientResponse {
  contracts: PaginatedResult<Contract>
}

export class FetchContractsByClientUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    client,
    page,
  }: FetchContractsByClientRequest): Promise<FetchContractsByClientResponse> {
    const contracts = await this.contractRepository.findByClient(client, page)
    return {
      contracts,
    }
  }
}
