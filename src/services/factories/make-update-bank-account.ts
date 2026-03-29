import { PrismaBankAccountRepository } from '../../repositories/prisma/prisma-bank-account-repository'
import { UpdateBankAccountUseCase } from '../accounts-payable/update-bank-account-use-case'

export function makeUpdateBankAccount() {
  const bankAccountRepository = new PrismaBankAccountRepository()
  return new UpdateBankAccountUseCase(bankAccountRepository)
}
