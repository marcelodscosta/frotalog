import { Contract, ContractStatus } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { ClientNotFoundError } from '../errors/client-not-found-error'
import { ContractAlreadyExistsError } from '../errors/contract-already-exist-error'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface UpdateContractRequest {
  id: string
  contract_number?: string
  description?: string | null
  clientId?: string
  responsible_name?: string | null
  responsible_phone?: string | null
  responsible_email?: string | null
  start_date?: Date
  end_date?: Date | null
  status?: ContractStatus
  total_value?: number | null
  billing_day?: number | null
  notes?: string | null
  is_Active?: boolean
}

interface UpdateContractResponse {
  contract: Contract
}

export class UpdateContractUseCase {
  constructor(
    private contractRepository: IContractRepository,
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(data: UpdateContractRequest): Promise<UpdateContractResponse> {
    const { id, ...updateData } = data

    const contract = await this.contractRepository.findById(id)

    if (!contract) {
      throw new ContractNotFoundError()
    }

    if (
      updateData.contract_number &&
      updateData.contract_number !== contract.contract_number
    ) {
      const contractWithSameNumber =
        await this.contractRepository.findByContractNumber(
          updateData.contract_number,
        )

      if (contractWithSameNumber) {
        throw new ContractAlreadyExistsError()
      }
    }

    if (updateData.clientId) {
      const client = await this.supplierRepository.findById(updateData.clientId)

      if (!client || !client.isClient) {
        throw new ClientNotFoundError()
      }
    }

    const updatedContract = await this.contractRepository.updateContract(
      id,
      updateData,
    )

    return { contract: updatedContract }
  }
}
