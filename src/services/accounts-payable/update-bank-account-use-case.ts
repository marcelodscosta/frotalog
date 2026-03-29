import { BankAccount } from '../../generated/prisma'
import { IBankAccountRepository } from '../../repositories/interfaces/IBankAccountRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateBankAccountRequest {
  id: string
  name?: string
  bank_name?: string
  agency?: string
  account_number?: string
}

interface UpdateBankAccountResponse {
  bankAccount: BankAccount
}

export class UpdateBankAccountUseCase {
  constructor(private bankAccountRepository: IBankAccountRepository) {}

  async execute(data: UpdateBankAccountRequest): Promise<UpdateBankAccountResponse> {
    const existing = await this.bankAccountRepository.findById(data.id)
    if (!existing) throw new ResourceNotFoundError()

    const bankAccount = await this.bankAccountRepository.update(data.id, {
      name: data.name,
      bank_name: data.bank_name,
      agency: data.agency,
      account_number: data.account_number,
    })
    return { bankAccount }
  }
}
