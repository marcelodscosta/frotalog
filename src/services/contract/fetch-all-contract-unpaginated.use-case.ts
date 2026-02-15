import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'

interface FetchAllContractsUnpaginatedResponse {
  contracts: Contract[]
}

export class FetchAllContractsUnpaginatedUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute(): Promise<FetchAllContractsUnpaginatedResponse> {
    const contracts = await this.contractRepository.findAllUnpaginated()

    return {
      contracts,
    }
  }
}
