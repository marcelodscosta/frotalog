import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface GetContractWithDetailsRequest {
  id: string
}

interface GetContractWithDetailsResponse {
  contract: Contract
}

export class GetContractWithDetailsUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    id,
  }: GetContractWithDetailsRequest): Promise<GetContractWithDetailsResponse> {
    const contract = await this.contractRepository.getContractWithDetails(id)

    if (!contract) {
      throw new ContractNotFoundError()
    }

    return {
      contract,
    }
  }
}
