import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface DeleteContractRequest {
  id: string
}

interface DeleteContractResponse {
  contract: Contract
}

export class DeleteContractUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    id,
  }: DeleteContractRequest): Promise<DeleteContractResponse> {
    const existingContract = await this.contractRepository.findById(id)

    if (!existingContract) {
      throw new ContractNotFoundError()
    }

    const contract = await this.contractRepository.deleteContract(id)

    return { contract }
  }
}
