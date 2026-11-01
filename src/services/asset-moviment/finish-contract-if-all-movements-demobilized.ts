import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'

const hasDemobilization = (date: Date | null, endOfToday: Date) =>
  Boolean(date) &&
  (date as Date).getFullYear() > 1970 &&
  (date as Date) <= endOfToday

/**
 * O contrato termina quando todos os equipamentos ativos já foram desmobilizados.
 * Datas futuras indicam desmobilização programada, então o contrato permanece ativo.
 * Só contratos ATIVOS são alterados; contratos sem movimentações permanecem como estão.
 */
export async function finishContractIfAllMovementsDemobilized(
  contractId: string,
  assetMovementRepository: IAssetMovementRepository,
  contractRepository: IContractRepository,
): Promise<void> {
  const contract = await contractRepository.findById(contractId)
  if (!contract || !contract.is_Active || contract.status !== 'ACTIVE') return

  const movements =
    await assetMovementRepository.getAssetMovementsSummaryByContract(contractId)
  const activeMovements = movements.filter((movement) => movement.is_active)

  if (activeMovements.length === 0) return

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  if (
    activeMovements.some(
      (movement) => !hasDemobilization(movement.demobilization_date, endOfToday),
    )
  ) {
    return
  }

  await contractRepository.updateStatus(contractId, 'FINISHED')
}
