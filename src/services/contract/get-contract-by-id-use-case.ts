import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface GetContractByIdRequest {
  id: string
}

interface GetContractByIdResponse {
  contract: Contract
}

export class GetContractByIdUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    id,
  }: GetContractByIdRequest): Promise<GetContractByIdResponse> {
    const contract = await this.contractRepository.findById(id)

    if (!contract) {
      throw new ContractNotFoundError()
    }

    return {
      contract,
    }
  }
}
