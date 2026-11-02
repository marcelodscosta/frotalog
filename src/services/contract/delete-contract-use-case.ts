import { Contract } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { AppError } from '../errors/app-error'
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

    const [movements, bulletins, invoices, commissions] = await Promise.all([
      prisma.assetMovement.count({ where: { contractId: id, is_active: true } }),
      prisma.measurementBulletin.count({ where: { contractId: id, is_active: true } }),
      prisma.invoice.count({ where: { contractId: id, is_active: true } }),
      prisma.commission.count({ where: { contractId: id } }),
    ])

    if (movements > 0 || bulletins > 0 || invoices > 0 || commissions > 0) {
      throw new AppError(
        'Não é possível excluir um contrato com movimentações, boletins, faturas ou comissões. Cancele esses registros primeiro.',
        400,
      )
    }

    const linkedProposal = await prisma.commercialProposal.findFirst({
      where: { contractId: id },
      select: { id: true },
    })

    const contract = await prisma.$transaction(async (tx) => {
      if (linkedProposal) {
        await tx.commercialProposal.update({
          where: { id: linkedProposal.id },
          data: { contractId: null, status: 'APPROVED' },
        })
      }

      return tx.contract.update({
        where: { id },
        data: { is_Active: false },
      })
    })

    return { contract }
  }
}
