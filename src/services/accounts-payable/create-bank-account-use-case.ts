import { BankAccount } from '../../generated/prisma'
import { IBankAccountRepository } from '../../repositories/interfaces/IBankAccountRepository'

interface CreateBankAccountRequest {
  name: string
  bank_name?: string
  agency?: string
  account_number?: string
  balance?: number
  initial_balance?: number
  initial_balance_date?: Date
}

interface CreateBankAccountResponse {
  bankAccount: BankAccount
}

export class CreateBankAccountUseCase {
  constructor(private bankAccountRepository: IBankAccountRepository) {}

  async execute(data: CreateBankAccountRequest): Promise<CreateBankAccountResponse> {
    const bankAccount = await this.bankAccountRepository.create({
      name: data.name,
      bank_name: data.bank_name,
      agency: data.agency,
      account_number: data.account_number,
      balance: data.balance ?? 0,
      initial_balance: data.initial_balance ?? 0,
      initial_balance_date: data.initial_balance_date ?? new Date(),
    })
    return { bankAccount }
  }
}
