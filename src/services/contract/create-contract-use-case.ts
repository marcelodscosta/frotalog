import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { ClientNotFoundError } from '../errors/client-not-found-error'
import { ContractAlreadyExistsError } from '../errors/contract-already-exist-error'

interface CreateContractRequest {
  contract_number: string
  description?: string | null
  clientId: string
  responsible_name?: string | null
  responsible_phone?: string | null
  responsible_email?: string | null
  start_date: Date
  end_date?: Date | null
  total_value?: number | null
  billing_day?: number | null
  notes?: string | null
}

interface CreateContractResponse {
  contract: Contract
}

export class CreateContractUseCase {
  constructor(
    private contractRepository: IContractRepository,
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(data: CreateContractRequest): Promise<CreateContractResponse> {
    const client = await this.supplierRepository.findById(data.clientId)

    if (!client || !client.isClient) {
      throw new ClientNotFoundError()
    }

    const contractWithSameNumber =
      await this.contractRepository.findByContractNumber(data.contract_number)

    if (contractWithSameNumber) {
      throw new ContractAlreadyExistsError()
    }

    // 3. Cria o contrato usando o repositório
    // O repositório já está preparado para receber o clientId diretamente (Unchecked)
    const contract = await this.contractRepository.create(data)

    return { contract }
  }
}
