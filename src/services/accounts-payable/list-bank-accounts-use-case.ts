import { BankAccount } from '../../generated/prisma'
import { IBankAccountRepository } from '../../repositories/interfaces/IBankAccountRepository'

interface ListBankAccountsResponse {
  bankAccounts: BankAccount[]
}

export class ListBankAccountsUseCase {
  constructor(private bankAccountRepository: IBankAccountRepository) {}

  async execute(): Promise<ListBankAccountsResponse> {
    const bankAccounts = await this.bankAccountRepository.findAll()
    return { bankAccounts }
  }
}
