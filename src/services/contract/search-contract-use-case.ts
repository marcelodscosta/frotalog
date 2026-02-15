import { Contract, ContractStatus } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface SearchContractsRequest {
  contract_number?: string
  description?: string
  client?: string
  status?: ContractStatus
  page: number
}

interface PaginatedResult<T> {
  items: T[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface SearchContractsResponse {
  contracts: PaginatedResult<Contract>
}

export class SearchContractsUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    contract_number,
    description,
    client,
    status,
    page,
  }: SearchContractsRequest): Promise<SearchContractsResponse> {
    const result = await this.contractRepository.search({
      contract_number,
      description,
      client,
      status,
      page,
    })

    if (result.totalItems === 0) {
      throw new ContractNotFoundError()
    }

    return {
      contracts: result,
    }
  }
}
