import { PrismaBankAccountRepository } from '../../repositories/prisma/prisma-bank-account-repository'
import { ListBankAccountsUseCase } from '../accounts-payable/list-bank-accounts-use-case'

export function makeListBankAccounts() {
  const bankAccountRepository = new PrismaBankAccountRepository()
  return new ListBankAccountsUseCase(bankAccountRepository)
}
