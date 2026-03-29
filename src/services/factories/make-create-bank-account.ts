import { PrismaBankAccountRepository } from '../../repositories/prisma/prisma-bank-account-repository'
import { CreateBankAccountUseCase } from '../accounts-payable/create-bank-account-use-case'

export function makeCreateBankAccount() {
  const bankAccountRepository = new PrismaBankAccountRepository()
  return new CreateBankAccountUseCase(bankAccountRepository)
}
