import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface GetContractByContractNumberRequest {
  contract_number: string
}

interface GetContractByContractNumberResponse {
  contract: Contract
}

export class GetContractByNumberUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    contract_number,
  }: GetContractByContractNumberRequest): Promise<GetContractByContractNumberResponse> {
    const contract =
      await this.contractRepository.findByContractNumber(contract_number)

    if (!contract) {
      throw new ContractNotFoundError()
    }

    return {
      contract,
    }
  }
}
